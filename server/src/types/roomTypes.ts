import { TPlayer } from "@shared/types/SharedTypes";
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

/** Specifies the details of the current round played in a room */
export type TCurrentRoundDetails = {
    /** Specifies the word known by the impostor */
    impostorWord: string;
    /** Specifies the secret word known by all players but the impostor */
    secretWord: string;
    /** Specifies the uuid of the player that plays the role of the impostor */
    impostor: TPlayer;
    /** Specifies the uuids of all the players except the impostor one */
    players: TPlayer[];
    /** Specifies if the impostor knows that he is the impostor */
    impostorHasHint: boolean;
}