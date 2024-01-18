import { RawData, WebSocket } from 'ws';
import { IWebSocketMessage, IWsPlayerJoinedMessage, IWsRoomStartedMessage, TRoomStore, WsJoinRoomPayload, WsRoomStartedPayload, WsStartRoomPayload } from "./schemas";
import { WS_MESSAGE_EVENT_CREATE_ROOM, WS_MESSAGE_EVENT_JOIN_ROOM, WS_MESSAGE_EVENT_START_ROOM } from './constants';
import Utils from './Utils';

export function handleWsClose(rooms: TRoomStore, connectionUuid: string) {    
    const roomsKey = Object.keys(rooms);

    roomsKey.forEach(roomKey => {
        const room = rooms[roomKey];
        const connectionsInRoom = Object.keys(room.players);

        connectionsInRoom.forEach(connectionInRoom => {
            const player = room.players[connectionInRoom];

            if (player.uuid === connectionUuid) {
                if (player.isAdmin) {
                    delete rooms[roomKey];
                    return;
                }
                else {
                    delete room.players[connectionUuid];
                }
            }
        });
    })
}

export function handleWsMessage(rooms: TRoomStore, socket: WebSocket, connectionUuid: string, data: RawData) {
    let  message: IWebSocketMessage;
    
    try {
        message = JSON.parse(data.toString());
    }
    catch (error) {
        return;
    }

    switch (message.event) {
        case WS_MESSAGE_EVENT_CREATE_ROOM:
            handleCreateRoom(rooms, socket, connectionUuid, message.payload.roomId);
            break;

        case WS_MESSAGE_EVENT_JOIN_ROOM:
            handleJoinRoom(rooms, socket, connectionUuid, message.payload);
            break;

        case WS_MESSAGE_EVENT_START_ROOM:
            handleStartRoom(rooms, message.payload);
            break;
    }
}

function handleCreateRoom(rooms: TRoomStore, socket: WebSocket, connectionUuid: string, roomId: string): void {
    if (roomId in rooms) {
        return;
    }

    rooms[roomId] = {
        roomId,
        round: 0,
        players: {
            [connectionUuid]: {
                socket,
                isAdmin: true,
                username: null,
                uuid: connectionUuid,
            }
        },
    }

    return;
}

function handleJoinRoom(rooms: TRoomStore, webSocket: WebSocket, connectionUuid: string, payload: WsJoinRoomPayload): void {
    const { guid, roomId, username } = { ...payload };

    if (!(roomId in rooms)) {
        return;
    }

    if (connectionUuid in rooms[roomId].players) {
        return;
    }

    rooms[roomId].players[connectionUuid] = { 
        guid, 
        username,
        isAdmin: false,
        socket: webSocket, 
        uuid: connectionUuid
    };

    const message: IWsPlayerJoinedMessage = {
        event: 'player-joined',
        payload: { guid, username }
    }

    // Sending notification to all the others players in the room
    Object.values(rooms[roomId].players)
        .filter(x => x.uuid !== connectionUuid)
        .forEach(x => x.socket.send(JSON.stringify(message)));
}

function handleStartRoom(rooms: TRoomStore, payload: WsStartRoomPayload) {
    const roomId = payload.roomId;

    if (!(roomId in rooms)) {
        return;
    }

    let players = Object.values(rooms[roomId].players);
    const { secretWord, impostorWord } = Utils.getWords(payload.areWordsRandom, payload.secretWord, payload.impostorWord);
    
    // Filtering out the admin if is not playing
    if (!payload.isMasterPlaying) {
        players = players.filter(x => !x.isAdmin);
    }
    
    const impostorIndex = Utils.getImpostorIndex(players.length);
    rooms[roomId].round = rooms[roomId].round + 1;

    // Sending its known word to each player
    players.forEach((player, index) => {
        let payloadToClient: WsRoomStartedPayload;
        
        if (index === impostorIndex) {
            payloadToClient = {
                roomId,
                knownWord: impostorWord,
                round: rooms[roomId].round,
                impostorHint: payload.impostorHasHint
            };
        }
        else {
            payloadToClient = {
                roomId,
                impostorHint: false,
                knownWord: secretWord,
                round: rooms[roomId].round
            };
        }

        const message : IWsRoomStartedMessage = { event: 'room-started', payload: payloadToClient };

        player.socket.send(JSON.stringify(message));
    });
}
