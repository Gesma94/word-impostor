import { WebSocket, RawData } from "ws";
import { roomStore } from "../storage/roomStore";
import Utils from "../Utils";
import { TWebSocketMessage, TWsMasterIsPlayingPayload, TWsMasterJoinRoomPayload, TWsMasterJoinRoomResponseMessage, TWsMasterJoinedRoomMessage, TWsPlayerJoinRoomPayload, TWsPlayerJoinRoomResponseMessage, TWsPlayerJoinedRoomMessage, TWsPlayerLeftRoomMessage, TWsRoundStartPayload, TWsRoundStartedMessage } from "@shared/types/WebSocketTypes";
import { WS_MSG_EVENTS_CONST } from "@shared/constants/WebSocket";
import { SharedUtils } from "@shared/utils/SharedUtils";

export function handleWsMessage(socket: WebSocket, data: RawData, userConnectionUuid: string) {
    let message: TWebSocketMessage;

    try {
        message = JSON.parse(data.toString());
    }
    catch (error) {
        return;
    }

    switch (message.event) {
        case WS_MSG_EVENTS_CONST.MASTER_JOIN_ROOM:
            handleMasterJoinRoom(socket, message.payload, userConnectionUuid);
            break;

        case WS_MSG_EVENTS_CONST.PLAYER_JOIN_ROOM:
            handlePlayerJoinRoom(socket, message.payload, userConnectionUuid);
            break;

        case WS_MSG_EVENTS_CONST.MASTER_IS_PLAYING:
            handleMasterIsPlaying(socket, message.payload, userConnectionUuid);
            break;

        case WS_MSG_EVENTS_CONST.START_ROUND:
            handleStartRound(socket, message.payload, userConnectionUuid);
            break;
    }
}

function handleMasterJoinRoom(socket: WebSocket, payload: TWsMasterJoinRoomPayload, userConnectionUuid: string) {
    const room = roomStore.get(payload.roomId);

    if (SharedUtils.isNullOrUndefined(room)) {
        return;
    }

    if (SharedUtils.isNotNullOrUndefined(room.masterConnections.find(x => x.connectionUuid !== userConnectionUuid))) {
        return;
    }

    room.masterConnections.push({ connectionUuid: userConnectionUuid, socket });

    if (SharedUtils.isNotNullOrUndefined(room.removerCallbackUuid)) {
        clearTimeout(room.removerCallbackUuid);
    }

    const message: TWsMasterJoinedRoomMessage = {
        event: WS_MSG_EVENTS_CONST.MASTER_JOINED_ROOM,
        payload: {}
    }

    Object.values(room.players).forEach(player => {
        player.connections.forEach(connection => {
            connection.socket.send(JSON.stringify(message));
        });
    });

    var playerWord = room.getPlayerKnonwWord(payload.masterUuid);

    const messageResponse: TWsMasterJoinRoomResponseMessage = {
        event: WS_MSG_EVENTS_CONST.MASTER_JOIN_ROOM_RESPONSE,
        payload: {
            currentRound: room.currentRound,
            hasStarted: room.hasStarted,
            impostorHasHint: room.getPlayerImpostorHasHint(payload.masterUuid),          
            players: Object.values(room.players).map(x => ({ uuid: x.uuid, username: x.username })),
            playerWord: playerWord ?? null
        }
    }

    room.sendToMaster(messageResponse);
}

function handlePlayerJoinRoom(socket: WebSocket, payload: TWsPlayerJoinRoomPayload, userConnectionUuid: string) {
    let username = payload.username;
    const room = roomStore.get(payload.roomId);

    if (SharedUtils.isNullOrUndefined(room)) {
        return;
    }

    const alreadyConnectedPlayer = Object.values(room.players).find(x => x.uuid === payload.playerUuid);

    if (SharedUtils.isNotNullOrUndefined(alreadyConnectedPlayer)) {
        alreadyConnectedPlayer.connections.push({ connectionUuid: userConnectionUuid, socket });
    }
    else {
        // In case the player was not connected already, add him and notify anyone else, including the master
        const messageToOtherPlayer: TWsPlayerJoinedRoomMessage = {
            event: WS_MSG_EVENTS_CONST.PLAYER_JOINED_ROOM,
            payload: { playerUuid: payload.playerUuid, username: payload.username }
        }

        Object.values(room.players).forEach(player => {
            player.connections.forEach(connection => {
                connection.socket.send(JSON.stringify(messageToOtherPlayer));
            });
        });

        // Notify the master that a new player joined
        const messageToMaster: TWsPlayerJoinedRoomMessage = {
            event: WS_MSG_EVENTS_CONST.PLAYER_JOINED_ROOM,
            payload: { playerUuid: payload.playerUuid, username: payload.username }
        }

        Object.values(room.masterConnections).forEach(masterConnection => {
            masterConnection.socket.send(JSON.stringify(messageToMaster));
        });

        // Add the player
        room.players[payload.playerUuid] = {
            username,
            uuid: payload.playerUuid,
            connections: [{ connectionUuid: userConnectionUuid, socket }]
        }
    }

    // send to him all the players in the room and its current word if the game has already started
    // and he was part of the current round
    var playerWord = room.getPlayerKnonwWord(payload.playerUuid);

    const messageToNewPlayer: TWsPlayerJoinRoomResponseMessage = {
        event: WS_MSG_EVENTS_CONST.PLAYER_JOIN_ROOM_RESPONSE,
        payload: {
            currentRound: room.currentRound,
            hasStarted: room.hasStarted,
            playerWord: playerWord ?? null,
            impostorHasHint: room.getPlayerImpostorHasHint(payload.playerUuid),
            players: Object.values(room.players).map(x => ({ playerUuid: x.uuid, username: x.username }))
        }
    }

    socket.send(JSON.stringify(messageToNewPlayer));

    return;
}

function handleMasterIsPlaying(socket: WebSocket, payload: TWsMasterIsPlayingPayload, userConnectionUuid: string) {
    let username = payload.username;
    let isPlaying = payload.isPlaying;
    let playerUuid = payload.playerUuid;
    const room = roomStore.get(payload.roomId);

    if (SharedUtils.isNullOrUndefined(room)) {
        return;
    }

    if (isPlaying) {
        const alreadyConnectedPlayer = Object.values(room.players).find(x => x.uuid === playerUuid);

        if (SharedUtils.isNotNullOrUndefined(alreadyConnectedPlayer)) {
            alreadyConnectedPlayer.connections.push({ connectionUuid: userConnectionUuid, socket });
        }
        else {
            // In case the player was not connected already, add him and notify anyone else, including the master
            const messageToOtherPlayer: TWsPlayerJoinedRoomMessage = {
                event: WS_MSG_EVENTS_CONST.PLAYER_JOINED_ROOM,
                payload: { playerUuid: playerUuid, username: payload.username }
            }

            Object.values(room.players).forEach(player => {
                player.connections.forEach(connection => {
                    connection.socket.send(JSON.stringify(messageToOtherPlayer));
                });
            });

            // Notify the master that a new player joined
            const messageToMaster: TWsPlayerJoinedRoomMessage = {
                event: WS_MSG_EVENTS_CONST.PLAYER_JOINED_ROOM,
                payload: { playerUuid: playerUuid, username: payload.username }
            }

            Object.values(room.masterConnections).forEach(masterConnection => {
                masterConnection.socket.send(JSON.stringify(messageToMaster));
            });

            // Add the player
            room.players[playerUuid] = {
                username,
                uuid: playerUuid,
                connections: room.masterConnections.map(x => ({ connectionUuid: x.connectionUuid, socket: x.socket}))
            }
        }

        return;
    }

    if (!isPlaying) {
        const leavingPlayers = Object.values(room.players)
        .filter(x => x.connections.some(connection => connection.connectionUuid === userConnectionUuid));

        // Returning right away if the user is not a player
        if (SharedUtils.isNullOrUndefined(leavingPlayers) || leavingPlayers.length < 1) {
            return;
        }

        const leavingPlayer = leavingPlayers[0];
        const indexInConnections = leavingPlayer.connections.findIndex(x => x.connectionUuid === userConnectionUuid);

        // Returning right away if the user is not a player
        if (indexInConnections === -1) {
            return;
        }

        // Removing the connection
        leavingPlayer.connections.splice(indexInConnections, 1);

        // Returning right away if the player is still connected from other WS session
        if (leavingPlayer.connections.length > 0) {
            return;
        }

        // Otherwise, notifying the master and all other players
        const messageToOtherPlayers: TWsPlayerLeftRoomMessage = {
            event: WS_MSG_EVENTS_CONST.PLAYER_LEFT_ROOM,
            payload: { playerUuid: leavingPlayer.uuid }
        }

        room.sendToMaster(messageToOtherPlayers);    
        room.sendToAllPlayers(messageToOtherPlayers);    

        // Finally, deleting the player from the room
        delete room.players[leavingPlayer.uuid];
    }
}

function handleStartRound(socket: WebSocket, payload: TWsRoundStartPayload, userConnectionUuid: string) {
    const room = roomStore.get(payload.roomId);

    if (SharedUtils.isNullOrUndefined(room)) {
        return;
    }

    const AllPlayers = Object.values(room.players);

    if (AllPlayers.length < 2) {
        return;
    }

    const impostorIndex = Utils.getImpostorIndex(AllPlayers.length);
    const { secretWord, impostorWord } = Utils.getWords(payload.areWordsRandom, payload.secretWord, payload.impostorWord);
    
    const impostor = AllPlayers[impostorIndex];
    const playersWithSecret = AllPlayers.filter(x => x.uuid !== impostor.uuid);

    const currentRound = room.startRound(playersWithSecret.map(x => x.uuid), impostor.uuid, secretWord, impostorWord, payload.impostorHasHint);

    playersWithSecret.forEach(playerWithSecret => {
        const messageToPlayerWithSecret: TWsRoundStartedMessage = {
            event: WS_MSG_EVENTS_CONST.ROUND_STARTED,
            payload: {
                impostorHint: false,
                round: currentRound,
                knownWord: secretWord
            }
        }

        room.sendToPlayer(playerWithSecret.uuid, messageToPlayerWithSecret);
    });

    const messageToImpostor: TWsRoundStartedMessage = {
        event: WS_MSG_EVENTS_CONST.ROUND_STARTED,
        payload: {
            round: currentRound,
            knownWord: impostorWord,
            impostorHint: payload.impostorHasHint,
        }
    }

    room.sendToPlayer(impostor.uuid, messageToImpostor);
}
