import type { WebSocket } from 'ws';

export type TWsConnection = {
    socket: WebSocket;
    connectionUuid: string;
}
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
