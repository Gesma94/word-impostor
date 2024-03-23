import { WebSocket, RawData } from "ws";
import { roomStore } from "../../storage/roomStore";
import { TWebSocketMessage, TWsMasterIsPlayingPayload, TWsMasterIsPlayingResponseMessage, TWsMasterJoinRoomPayload, TWsMasterJoinRoomResponseMessage, TWsMasterJoinedRoomMessage, TWsPlayerJoinRoomPayload, TWsPlayerJoinRoomResponseMessage, TWsPlayerJoinedRoomMessage, TWsPlayerLeftRoomMessage, TWsRoundStartPayload, TWsRoundStartedMessage } from "@shared/types/WebSocketTypes";
import { WS_MSG_EVENTS_CONST } from "@shared/constants/WebSocket";
import { SharedUtils } from "@shared/utils/SharedUtils";
import { words } from "src/data/words";
import { Room } from "src/storage/room";

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
            handleMasterToggleIsPlaying(socket, message.payload, userConnectionUuid);
            break;

        case WS_MSG_EVENTS_CONST.START_ROUND:
            handleStartRound(message.payload);
            break;
    }
}

function handleMasterJoinRoom(socket: WebSocket, payload: TWsMasterJoinRoomPayload, userConnectionUuid: string) {
    const room = roomStore.get(payload.roomId);

    if (SharedUtils.isNullOrUndefined(room)) {
        return;
    }

    /* Stops the remover callback */
    room.stopRemoverCallbackTimeout();

    /* Returns right away in case the master connection is already saved */
    if (SharedUtils.isNotNullOrUndefined(room.masterConnections.find(x => x.connectionUuid !== userConnectionUuid))) {
        return;
    }

    /* Adds the master connection and its socket to the master connections */
    room.masterConnections.push({ connectionUuid: userConnectionUuid, socket });

    /* Notifies all players in the room that the master has joined */
    room.sendToAllPlayers({ event: WS_MSG_EVENTS_CONST.MASTER_JOINED_ROOM, payload: {} });

    /* Notifies the master about the state of the current round, and its known word, if it is playing */
    const messageResponse: TWsMasterJoinRoomResponseMessage = {
        event: WS_MSG_EVENTS_CONST.MASTER_JOIN_ROOM_RESPONSE,
        payload: {
            hasStarted: room.hasStarted,
            currentRound: room.currentRound,
            playerWord: room.getPlayerKnonwWord(payload.masterUuid) ?? null,
            impostorHasHint: room.getPlayerImpostorHasHint(payload.masterUuid),          
            players: Object.values(room.players).map(x => ({ uuid: x.uuid, username: x.username }))
        }
    }

    room.sendToMaster(messageResponse);
}

function handlePlayerJoinRoom(socket: WebSocket, payload: TWsPlayerJoinRoomPayload, userConnectionUuid: string) {
    const room = roomStore.get(payload.roomId);

    if (SharedUtils.isNullOrUndefined(room)) {
        return;
    }

    /* Add the player into the room and notifies both other players and the master */
    room.addPlayer(payload.playerUuid, payload.username, userConnectionUuid, socket);

    /* Sends to the new player the information about all the other players, and any details he should know about the current round */
    const messageToNewPlayer: TWsPlayerJoinRoomResponseMessage = {
        event: WS_MSG_EVENTS_CONST.PLAYER_JOIN_ROOM_RESPONSE,
        payload: {
            hasStarted: room.hasStarted,
            players: room.getAllPlayers(),
            currentRound: room.currentRound,
            playerWord: room.getPlayerKnonwWord(payload.playerUuid),
            impostorHasHint: room.getPlayerImpostorHasHint(payload.playerUuid)
        }
    }

    socket.send(JSON.stringify(messageToNewPlayer));
}

function handleMasterToggleIsPlaying(socket: WebSocket, payload: TWsMasterIsPlayingPayload, userConnectionUuid: string) {
    const room = roomStore.get(payload.roomId);

    if (SharedUtils.isNullOrUndefined(room)) {
        return;
    }

    if (payload.isPlaying) {
        handleMasterIsNowPlaying(room, socket, payload, userConnectionUuid);
    }
    else {
        handleMasterIsNowNotPlaying(room, socket, payload, userConnectionUuid);
    }
}

function handleStartRound(payload: TWsRoundStartPayload) {
    const room = roomStore.get(payload.roomId);

    if (SharedUtils.isNullOrUndefined(room)) {
        return;
    }

    const allPlayers = room.getAllPlayers();

    if (allPlayers.length < 2) {
        return;
    }

    /* Computes impostor, players, and secret and impostor words */
    const impostor = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    const playersWithSecret = allPlayers.filter(x => x !== impostor);
    const { secretWord, impostorWord } = getWords(payload.areWordsRandom, payload.secretWord, payload.impostorWord);

    /* Starts a new round */
    const currentRound = room.startRound(playersWithSecret, impostor, secretWord, impostorWord, payload.impostorHasHint);

    /* Notifies all players sending to them the secret word */
    const messageToPlayerWithSecret: TWsRoundStartedMessage = {
        event: WS_MSG_EVENTS_CONST.ROUND_STARTED,
        payload: {
            impostorHint: false,
            round: currentRound,
            knownWord: secretWord
        }
    }

    playersWithSecret.forEach(playerWithSecret => {
        room.sendToPlayer(playerWithSecret.uuid, messageToPlayerWithSecret);
    });

    /* Notifies the impostor with the impostor word */
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

function getWords(areWordsRandom: boolean, secretWord: string, impostorWord: string): { secretWord: string; impostorWord: string; } {
    if (!areWordsRandom) {
        return { secretWord, impostorWord };
    }

    const randomWordsIndex = Math.floor(Math.random() * words.length);
    const randomSecretWordIndex = Math.floor(Math.random() * 2);

    return {
        secretWord: words[randomWordsIndex][randomSecretWordIndex],
        impostorWord: words[randomWordsIndex][randomSecretWordIndex === 0 ? 1 : 0],
    }
}

function handleMasterIsNowPlaying(room: Room, socket: WebSocket, payload: TWsMasterIsPlayingPayload, userConnectionUuid: string) {
    /* Marks that the master is now playing */
    room.isMasterPlaying = true;
    
    /* Add the master into the room and notifies both other players and the master */
    room.addPlayer(payload.playerUuid, payload.username, userConnectionUuid, socket);

    /* Notifies to all master connection that he is now playing */
    const response : TWsMasterIsPlayingResponseMessage = {
        payload: { isPlaying: true },
        event: WS_MSG_EVENTS_CONST.MASTER_IS_PLAYING_RESPONSE
    }

    room.sendToMaster(response);
}

function handleMasterIsNowNotPlaying(room: Room, socket: WebSocket, payload: TWsMasterIsPlayingPayload, userConnectionUuid: string) {
    /* Marks that the master is now playing */
    room.isMasterPlaying = false;

    const leavingPlayer = room.getPlayerByConnection(userConnectionUuid);

    /* Returns right away if the user is not a player */
    if (SharedUtils.isNullOrUndefined(leavingPlayer)) {
        return;
    }

    /* Removes the master from the players */
    delete room.players[leavingPlayer.uuid];

    /* Notifies to all master connection that he is now not playing anymore */
    const response : TWsMasterIsPlayingResponseMessage = {
        payload: { isPlaying: false },
        event: WS_MSG_EVENTS_CONST.MASTER_IS_PLAYING_RESPONSE
    }

    room.sendToMaster(response);
}