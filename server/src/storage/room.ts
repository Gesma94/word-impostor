import { TCurrentRoundDetails, TPlayerPool } from "src/types/roomTypes";
import Utils from "../Utils";
import { TWsConnection } from "../types/webSocketTypes";

export class Room {
    public roomId: string;
    public masterUuid: string;
    public currentRound: number;
    public hasStarted: boolean;
    public players: TPlayerPool;
    public currentRoundDetails: TCurrentRoundDetails; 
    public masterConnections: TWsConnection[];
    public removerCallbackUuid: NodeJS.Timeout | null = null;

    private _deleteFromStoreCallback: (roomId: string) => boolean;

    constructor(roomId: string, masterUuid: string, deleteFromStoreCallback: (roomId: string) => boolean) {
        this.players = {};
        this.roomId = roomId;
        this.currentRound = 0;
        this.hasStarted = false;
        this.masterConnections = [];
        this.masterUuid = masterUuid;
        this.currentRoundDetails = { playersGuid: [], impostorHasHint: false };

        this._deleteFromStoreCallback = deleteFromStoreCallback;

        this.startRemoverCallbackTimeout();
    }

    public sendToAllPlayers(message: unknown) {
        Object.values(this.players).forEach(player => {
            this.sendToPlayer(player.uuid, message);
        });    
    }

    public sendToMaster(message: unknown) {
        this.masterConnections.forEach(x => {
            x.socket.send(JSON.stringify(message));
        })
    }

    public sendToPlayer(playerUuid: string, message: unknown) {
        const player = this.players[playerUuid];

        if (Utils.isNullOrUndefined(player)) {
            return;
        }

        player.connections.forEach(connection => {
            connection.socket.send(JSON.stringify(message));
        });
    }

    public startRemoverCallbackTimeout() {
        if (Utils.isNotNullOrUndefined(this.removerCallbackUuid)) {
            clearTimeout(this.removerCallbackUuid);
        }

        setTimeout(this._deleteFromStoreCallback, 1800000);
    }

    public getPlayerKnonwWord(playerGuid: string): string | undefined {
        if (Utils.isNullOrUndefined(this.currentRoundDetails) || Utils.isNullOrUndefined(this.currentRoundDetails.playersGuid)) {
            return undefined;
        }

        if (this.currentRoundDetails.impostorGuid === playerGuid) {
            return this.currentRoundDetails.impostorWord;
        }

        if (this.currentRoundDetails.playersGuid.includes(playerGuid)) {
            return this.currentRoundDetails.secretWord;
        }

        return undefined;
    }
    

    public getPlayerImpostorHasHint(playerGuid: string): boolean {
        if (Utils.isNullOrUndefined(this.currentRoundDetails) || Utils.isNullOrUndefined(this.currentRoundDetails.playersGuid)) {
            return false;
        }

        if (this.currentRoundDetails.impostorGuid === playerGuid) {
            return this.currentRoundDetails.impostorHasHint;
        }
        
        return false;
    }

    public startRound(playersGuid: string[], impostorGuid: string, secretWord: string, impostorWord: string, impostorHasHint: boolean): number {
        this.currentRound++;
        this.hasStarted = true;
        
        this.currentRoundDetails = {
            secretWord,
            playersGuid,
            impostorGuid,
            impostorWord,
            impostorHasHint
        }

        return this.currentRound;
    }
}