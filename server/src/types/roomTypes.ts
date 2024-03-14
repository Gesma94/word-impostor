import { TWsConnection } from "./webSocketTypes";

/** Specifies the properties of a player in the room */
export type TRoomPlayer = {
    /** Specifies the uuid of the player, given by the client */
    uuid: string;
    /** Specifies the username of the player */
    username: string;
    /** Specifies all the WebSocket connections of the player */
    connections: TWsConnection[];
}

/** Specifies the pool of players in a room */
export type TPlayerPool = {
    /** Specifies the player in the room */
    [playerUuid: string]: TRoomPlayer;
} 


export type TCurrentRoundDetails = {
    impostorWord?: string;
    secretWord?: string;
    impostorGuid?: string;
    playersGuid: string[];
    impostorHasHint: boolean;
}