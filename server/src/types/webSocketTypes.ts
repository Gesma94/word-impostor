import { WebSocket } from "ws";

/** Specifies a WebSocket connection identified by a uuid */
export type TWsConnection = {
    /** Specifies the socket of the connection */
    socket: WebSocket;
    /** Specifies a uuid for the connection */
    connectionUuid: string;
}