import type { WebSocket } from 'ws';
import { WS_MESSAGE_EVENT_CREATE_ROOM, WS_MSG_EVT_PLAYER_JOIN_ROOM, WS_MESSAGE_EVENT_PLAYER_JOIN, WS_MESSAGE_EVENT_PLAYER_LEFT, WS_MSG_EVT_MASTER_JOINED_ROOM, WS_MSG_EVT_MASTER_JOIN_ROOM, WS_MSG_EVT_MASTER_LEFT_ROOM, WS_MSG_EVT_PLAYER_LEFT_ROOM, WS_MSG_EVT_PLAYER_JOINED_ROOM, WS_MSG_EVT_PLAYER_JOIN_ROOM_RESPONSE, WS_MSG_EVT_MASTER_IS_PLAYING, WS_MSG_EVT_START_ROUND, WS_MSG_EVT_ROUND_STARTED, WS_MSG_EVT_MASTER_JOIN_ROOM_RESPONSE } from './constants';
import { TPlayer } from './types';

export type TWsConnection = {
    socket: WebSocket;
    connectionUuid: string;
}

type WsMessageBase<TEvent extends string, TPayload> = {
    event: TEvent;
    payload: TPayload;
}

export type WsPlayerJoinRoomPayload = {
    roomId: string;
    username: string;
    playerUuid: string;
}

export type WsPlayerJoinedRoomPayload = {
    username: string;
    playerUuid: string;
}

export type WsPlayerJoinRoomResponsePayload = {
    currentRound: number;
    hasStarted: boolean;
    playerWord: string | null;
    impostorHasHint: boolean;
    players: { username: string; playerUuid: string; }[];
}


type WsCreateRoomPayload = {
    roomId: string;
}

export type WsRoundStartPayload = {
    roomId: string;
    secretWord: string;
    impostorWord: string;  
    areWordsRandom: boolean;
    impostorHasHint: boolean;
    isMasterPlaying: boolean;  
}

export type WsGameStartedPayload = {
    round: number;
    knownWord: string;
    impostorHint: boolean;
}

type WsPlayerJoinedPayload = {
    guid: string;
    username: string;
}

type WsPlayerLeftPayload = {
    guid: string;
}


export type WsMasterJoinRoomPayload = {
    roomId: string;
    masterUuid: string;
}

export type WsMasterIsPlayingPayload = {
    roomId: string;
    isPlaying: boolean;
    username: string;
    playerUuid: string;
}

export type WsPlayerLeftRoomPayload = {
    playerUuid: string;
}

export type WsRoundStartedPayload = {
    round: number;
    knownWord: string;
    impostorHint: boolean;
}

export type WsMasterJoinRoomResponsePayload = {
    currentRound: number;
    hasStarted: boolean;
    playerWord: string | null;
    impostorHasHint: boolean;
    players: TPlayer[];
}

export type IWsPlayerLeftMessage = WsMessageBase<typeof WS_MESSAGE_EVENT_PLAYER_LEFT, WsPlayerLeftPayload>;
export type IWsCreateRoomMessage = WsMessageBase<typeof WS_MESSAGE_EVENT_CREATE_ROOM, WsCreateRoomPayload>;
export type IWsPlayerJoinedMessage = WsMessageBase<typeof WS_MESSAGE_EVENT_PLAYER_JOIN, WsPlayerJoinedPayload>;

export type IWsPlayerJoinRoomMessage = WsMessageBase<typeof WS_MSG_EVT_PLAYER_JOIN_ROOM, WsPlayerJoinRoomPayload>;
export type IWsPlayerJoinedRoomMessage = WsMessageBase<typeof WS_MSG_EVT_PLAYER_JOINED_ROOM, WsPlayerJoinedRoomPayload>;
export type IWsPlayerJoinRoomResponseMessage = WsMessageBase<typeof WS_MSG_EVT_PLAYER_JOIN_ROOM_RESPONSE, WsPlayerJoinRoomResponsePayload>;
export type IWsMasterJoinRoomMessage = WsMessageBase<typeof WS_MSG_EVT_MASTER_JOIN_ROOM, WsMasterJoinRoomPayload>;
export type IWsMasterIsPlayingMessage = WsMessageBase<typeof WS_MSG_EVT_MASTER_IS_PLAYING, WsMasterIsPlayingPayload>;
export type IWsMasterJoinedRoomMessage = WsMessageBase<typeof WS_MSG_EVT_MASTER_JOINED_ROOM, {}>;
export type IWsMasterLeftRoomMessage = WsMessageBase<typeof WS_MSG_EVT_MASTER_LEFT_ROOM, {}>;
export type IWsPlayerLeftRoomMessage = WsMessageBase<typeof WS_MSG_EVT_PLAYER_LEFT_ROOM, WsPlayerLeftRoomPayload>;
export type IWsStartRoundMessage = WsMessageBase<typeof WS_MSG_EVT_START_ROUND, WsRoundStartPayload>;
export type IWsRoundStartedMessage = WsMessageBase<typeof WS_MSG_EVT_ROUND_STARTED, WsRoundStartedPayload>;
export type IWsMasterJoinRoomResponseMessage = WsMessageBase<typeof WS_MSG_EVT_MASTER_JOIN_ROOM_RESPONSE, WsMasterJoinRoomResponsePayload>;

export type IWebSocketMessage = IWsPlayerJoinRoomMessage | IWsStartRoundMessage | IWsPlayerLeftMessage | IWsCreateRoomMessage | IWsPlayerJoinedMessage | IWsMasterJoinRoomMessage | IWsMasterJoinedRoomMessage
| IWsMasterLeftRoomMessage | IWsPlayerLeftRoomMessage | IWsPlayerJoinedRoomMessage | IWsPlayerJoinRoomResponseMessage | IWsMasterIsPlayingMessage | IWsStartRoundMessage | IWsRoundStartedMessage | IWsMasterJoinRoomResponseMessage;

export type SqliteTableCounter = {
    counter: number;
}


export type TRoomStore = {
    [key: string]: TRoom;
}

export type TRoom = {
    roomId: string;
    round: number;
    players: {
        [key: string]: TRoomPlayer;
    };
}

export type TRoomNew = {
    roomId: string;
    masterUuid: string;
    currentRound: number;
    masterConnections: TWsConnection[];
    removerCallbackUuid: NodeJS.Timeout;
    players: {
        [key: string]: TRoomPlayer;
    };
}

export type TRoomPlayer = {
    /** Uuid provided by the client-side */
    uuid: string;
    username: string;
    connections: TWsConnection[];
}

export type TPlayerPool = {
    [playerUuid: string]: TRoomPlayer;
}


export type TCurrentRoundDetails = {
    impostorWord?: string;
    secretWord?: string;
    impostorGuid?: string;
    playersGuid: string[];
}
