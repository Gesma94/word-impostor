import { WS_MSG_EVENTS } from "../constants/WebSocket";
import { TPlayer, ValueOf } from "./SharedTypes";

export type TWsMsgEvent = ValueOf<typeof WS_MSG_EVENTS>;

type TWsMessageBase<TEvent extends TWsMsgEvent, TPayload> = {
    event: TEvent;
    payload: TPayload;
}

/** Websocket message payload sent from the client to the server when a player wants to join a room */
export type TWsPlayerJoinRoomPayload = {
    roomId: string;
    username: string;
    playerUuid: string;
}

/** Websocket message payload sent from the server to a client in response of the player has joined the room */
export type TWsPlayerJoinRoomResponsePayload = {
    hasStarted: boolean;
    currentRound: number;
    impostorHasHint: boolean;
    playerWord: string | null;
    players: { username: string; playerUuid: string; }[];
}


/** Websocket message payload sent from the server to multiple clients when a player has joined a room */
export type TWsPlayerJoinedRoomPayload = {
    username: string;
    playerUuid: string;
}

/** Websocket message payload sent from the client to the server when the master wants to start a round */
export type TWsRoundStartPayload = {
    roomId: string;
    secretWord: string;
    impostorWord: string;  
    areWordsRandom: boolean;
    impostorHasHint: boolean;
    isMasterPlaying: boolean;  
}

/** Websocket message payload sent from the server to multiple clients when the master has started a round */
export type TWsRoundStartedPayload = {
    round: number;
    knownWord: string;
    impostorHint: boolean;
}

/** Websocket message payload sent from the client to the server when the master joins its room */
export type TWsMasterJoinRoomPayload = {
    roomId: string;
    masterUuid: string;
}

/** Websocket message payload sent from the server to the client from which the master has joined the room */
export type TWsMasterJoinRoomResponsePayload = {
    players: TPlayer[];
    hasStarted: boolean;
    currentRound: number;
    impostorHasHint: boolean;
    playerWord: string | null;
}

/** Websocket message payload sent from the client to the server when the master toggle himself as player or non-player */
export type TWsMasterIsPlayingPayload = {
    roomId: string;
    username: string;
    isPlaying: boolean;
    playerUuid: string;
}

/** Websocket message payload sent from the server to multiple clients when a player has left a room */
export type TWsPlayerLeftRoomPayload = {
    playerUuid: string;
}

/** Websocket message sent from the client to the server when a player wants to join a room */
export type TWsPlayerJoinRoomMessage = TWsMessageBase<typeof WS_MSG_EVENTS.PLAYER_JOIN_ROOM, TWsPlayerJoinRoomPayload>;

/** Websocket message sent from the server to a client in response of the player has joined the room */
export type TWsPlayerJoinRoomResponseMessage = TWsMessageBase<typeof WS_MSG_EVENTS.PLAYER_JOIN_ROOM_RESPONSE, TWsPlayerJoinRoomResponsePayload>;

/** Websocket message sent from the server to multiple clients when a player has joined a room */
export type TWsPlayerJoinedRoomMessage = TWsMessageBase<typeof WS_MSG_EVENTS.PLAYER_JOINED_ROOM, TWsPlayerJoinedRoomPayload>;

/** Websocket message sent from the client to the server when the master wants to start a round */
export type TWsStartRoundMessage = TWsMessageBase<typeof WS_MSG_EVENTS.START_ROUND, TWsRoundStartPayload>;

/** Websocket message sent from the server to multiple clients when the master has started a round */
export type TWsRoundStartedMessage = TWsMessageBase<typeof WS_MSG_EVENTS.ROUND_STARTED, TWsRoundStartedPayload>;

/** Websocket message sent from the client to the server when the master joins its room */
export type TWsMasterJoinRoomMessage = TWsMessageBase<typeof WS_MSG_EVENTS.MASTER_JOIN_ROOM, TWsMasterJoinRoomPayload>;

/** Websocket message sent from the server to the client from which the master has joined the room */
export type TWsMasterJoinRoomResponseMessage = TWsMessageBase<typeof WS_MSG_EVENTS.MASTER_JOIN_ROOM_RESPONSE, TWsMasterJoinRoomResponsePayload>;

/** Websocket message sent from the server to multiple clients when the master has joined its room */
export type TWsMasterJoinedRoomMessage = TWsMessageBase<typeof WS_MSG_EVENTS.MASTER_JOINED_ROOM, {}>;

/** Websocket message sent from the client to the server when the master toggle himself as player or non-player */
export type TWsMasterIsPlayingMessage = TWsMessageBase<typeof WS_MSG_EVENTS.MASTER_IS_PLAYING, TWsMasterIsPlayingPayload>;

/** Websocket message sent from the server to multiple clients when a player has left a room */
export type TWsPlayerLeftRoomMessage = TWsMessageBase<typeof WS_MSG_EVENTS.PLAYER_LEFT_ROOM, TWsPlayerLeftRoomPayload>;

/** Websocket message sent from the server to multiple clients when a master has left its room */
export type TWsMasterLeftRoomMessage = TWsMessageBase<typeof WS_MSG_EVENTS.MASTER_LEFT_ROOM, {}>;

/** Specifies any possible Websocket message */
export type TWebSocketMessage = TWsPlayerJoinRoomMessage
    | TWsStartRoundMessage
    | TWsMasterJoinRoomMessage
    | TWsMasterJoinedRoomMessage
    | TWsMasterLeftRoomMessage
    | TWsPlayerLeftRoomMessage
    | TWsPlayerJoinedRoomMessage
    | TWsPlayerJoinRoomResponseMessage
    | TWsMasterIsPlayingMessage
    | TWsStartRoundMessage
    | TWsRoundStartedMessage
    | TWsMasterJoinRoomResponseMessage;