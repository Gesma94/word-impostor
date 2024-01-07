import type { WebSocket } from 'ws';
import { WS_MESSAGE_EVENT_CREATE_ROOM, WS_MESSAGE_EVENT_JOIN_ROOM, WS_MESSAGE_EVENT_PLAYER_JOIN, WS_MESSAGE_EVENT_ROOM_STARTED, WS_MESSAGE_EVENT_START_ROOM } from './constants';

type WsMessageBase<TEvent extends string, TPayload> = {
    event: TEvent;
    payload: TPayload;
}

type WsCreateRoomPayload = {
    roomId: string;
    secretWord: string;
    impostorWord: string;    
}

type WsJoinRoomPayload = {
    roomId: string;
    username: string;
}

type WsStartRoomPayload = {
    roomId: string;
}

type WsRoomStartedPayload = {
    roomId: string;
    knownWord: string;
}

type WsPlayerJoinedPayload = {
    username: string;
}

export type IWsJoinRoomMessage = WsMessageBase<typeof WS_MESSAGE_EVENT_JOIN_ROOM, WsJoinRoomPayload>;
export type IWsStartRoomMessage = WsMessageBase<typeof WS_MESSAGE_EVENT_START_ROOM, WsStartRoomPayload>;
export type IWsCreateRoomMessage = WsMessageBase<typeof WS_MESSAGE_EVENT_CREATE_ROOM, WsCreateRoomPayload>;
export type IWsRoomStartedMessage = WsMessageBase<typeof WS_MESSAGE_EVENT_ROOM_STARTED, WsRoomStartedPayload>;
export type IWsPlayerJoinedMessage = WsMessageBase<typeof WS_MESSAGE_EVENT_PLAYER_JOIN, WsPlayerJoinedPayload>;

export type IWebSocketMessage = IWsJoinRoomMessage | IWsStartRoomMessage | IWsCreateRoomMessage | IWsRoomStartedMessage | IWsPlayerJoinedMessage;

export type SqliteTableCounter = {
    counter: number;
}


export type TRoomStore = {
    [key: string]: TRoom;
}

export type TRoom = {
    roomId: string;
    secretWord: string;
    impostorWord: string;
    connections: {
        [key: string]: TConnection;
    };
}

export type TConnection = {
    uuid: string;
    isAdmin: boolean;
    username: string | null;
    socket: WebSocket;
}