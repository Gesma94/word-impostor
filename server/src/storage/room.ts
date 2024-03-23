import { WebSocket } from "ws";
import { TCurrentRoundDetails, TPlayerPool, TRoomPlayer } from "src/types/roomTypes";
import { TWsConnection } from "../types/webSocketTypes";
import { SharedUtils } from "@shared/utils/SharedUtils";
import { TPlayer } from "@shared/types/SharedTypes";
import { TWsPlayerJoinedRoomMessage } from "@shared/types/WebSocketTypes";
import { WS_MSG_EVENTS_CONST } from "@shared/constants/WebSocket";

/** Specifies a class that acts like a room where a game of Word Impostor is played */
export class Room {
    public roomId: string;
    public masterUuid: string;
    public hasStarted: boolean;
    public currentRound: number;
    public players: TPlayerPool;
    public isMasterPlaying: boolean;
    public masterConnections: TWsConnection[];
    public removerCallbackUuid: NodeJS.Timeout | null;
    public currentRoundDetails: TCurrentRoundDetails | null; 

    private _deleteFromStoreCallback: (roomId: string) => boolean;

    constructor(roomId: string, masterUuid: string, deleteFromStoreCallback: (roomId: string) => boolean) {
        this.players = {};
        this.roomId = roomId;
        this.currentRound = 0;
        this.hasStarted = false;
        this.masterConnections = [];
        this.isMasterPlaying = false;
        this.masterUuid = masterUuid;
        this.currentRoundDetails = null;
        this.removerCallbackUuid = null;
        this._deleteFromStoreCallback = deleteFromStoreCallback;
    }

    /** Sends {@link message} to all the connections to all players */
    public sendToAllPlayers(message: unknown) {
        Object.values(this.players).forEach(player => {
            this.sendToPlayer(player.uuid, message);
        });    
    }

    /** Sends {@link message} to all the connections related to player identified by {@link playerUuid} */
    public sendToPlayer(playerUuid: string, message: unknown) {
        const player = this.players[playerUuid];

        if (SharedUtils.isNullOrUndefined(player)) {
            return;
        }

        player.connections.forEach(connection => {
            connection.socket.send(JSON.stringify(message));
        });
    }

    /** Sends {@link message} to all the connections of the room master */
    public sendToMaster(message: unknown) {
        this.masterConnections.forEach(x => {
            x.socket.send(JSON.stringify(message));
        })
    }

    /** Stops the timeout, if it exists, after which the remover callback is called */
    public stopRemoverCallbackTimeout() {
        if (SharedUtils.isNotNullOrUndefined(this.removerCallbackUuid)) {
            clearTimeout(this.removerCallbackUuid);
        }
    }   

    /** Starts the timeout after which the remover callback is called */
    public startRemoverCallbackTimeout() {
        this.stopRemoverCallbackTimeout();
        setTimeout(this._deleteFromStoreCallback, 1800000);
    }

    /** Gets a {@link TRoomPlayer} in this room identified by one of its connection */
    public getPlayerByConnection(connectionUuid: string): TRoomPlayer | undefined {
        return Object.values(this.players).find(player => {
            return player.connections.some(connection => connection.connectionUuid === connectionUuid);
        });
    }

    /** Gets a {@link TRoomPlayer} in this room identified by its uuid */
    public getPlayerByUuid(playerUuid: string): TRoomPlayer | undefined {
        return Object.values(this.players).find(player => player.uuid === playerUuid);
    }

    /** Gets all the {@link TPlayer} in the room */
    public getAllPlayers(): TPlayer[] {
        return Object.values(this.players).map(x => ({ username: x.username, uuid: x.uuid }));
    }

    /** Gets the known word of the player identified by {@link playerGuid} in the current round, if it exists */
    public getPlayerKnonwWord(playerGuid: string): string | null {
        if (SharedUtils.isNullOrUndefined(this.currentRoundDetails) || SharedUtils.isNullOrUndefined(this.currentRoundDetails.players)) {
            return null;
        }

        if (this.currentRoundDetails.impostor.uuid === playerGuid) {
            return this.currentRoundDetails.impostorWord;
        }

        if (this.currentRoundDetails.players.some(x => x.uuid === playerGuid)) {
            return this.currentRoundDetails.secretWord;
        }

        return null;
    }
    
    /** Adds the player identified by {@link playerUuid} in the room and sends the notifications to all the other players and to the master */
    public addPlayer(playerUuid: string, username: string, connectionUuid: string, socket: WebSocket) {
        const alreadyConnectedPlayer = this.getPlayerByUuid(playerUuid);

        /* Adding just the WebSocket connection uuid if the player is already connected from other device */
        if (SharedUtils.isNotNullOrUndefined(alreadyConnectedPlayer)) {
            alreadyConnectedPlayer.connections.push({ connectionUuid: connectionUuid, socket });
        }
        else {
            const playerJoinedMessage : TWsPlayerJoinedRoomMessage = {
                event: WS_MSG_EVENTS_CONST.PLAYER_JOINED_ROOM,
                payload: { playerUuid, username }
            }
    
            /* Notifies all players that a new player has joined the room */
            this.sendToAllPlayers(playerJoinedMessage);
    
            /* Notifies the master that a new player has joined the room */
            this.sendToMaster(playerJoinedMessage);
    
            /* Add the player into the room */
            this.players[playerUuid] = {
                username,
                uuid: playerUuid,
                connections: [
                    {
                        socket,
                        connectionUuid
                    }
                ]
            };
        }
    }

    /** Gets if the player identified by {@link playerGuid} has the impostor hint in the current round, if it exists */
    public getPlayerImpostorHasHint(playerGuid: string): boolean {
        if (SharedUtils.isNullOrUndefined(this.currentRoundDetails) || SharedUtils.isNullOrUndefined(this.currentRoundDetails.players)) {
            return false;
        }

        if (this.currentRoundDetails.impostor.uuid === playerGuid) {
            return this.currentRoundDetails.impostorHasHint;
        }
        
        return false;
    }

    /** Starts a new round with the provided parameters, and returns the new current round number */
    public startRound(players: TPlayer[], impostor: TPlayer, secretWord: string, impostorWord: string, impostorHasHint: boolean): number {
        this.currentRound++;
        this.hasStarted = true;
        
        this.currentRoundDetails = {
            players,
            impostor,
            secretWord,
            impostorWord,
            impostorHasHint
        }

        return this.currentRound;
    }
}