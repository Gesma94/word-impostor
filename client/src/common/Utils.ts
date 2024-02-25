import { v4 as uuidv4 } from 'uuid';
import { LOCAL_STORAGE_USER_USERNAME_KEY, LOCAL_STORAGE_USER_UUID_KEY } from './constants';
import { redirect } from '@solidjs/router';
import { TPlayer } from './types';

export default class Utils {
    public static isNotNullOrUndefined<T>(value: T): value is NonNullable<T> {
        return value !== undefined && value !== null;
    }

    public static isNullOrUndefined(value: unknown): value is null | undefined {
        return value === undefined || value === null;
    }

    public static generateRoomId(): string {
        let roomId = '';

        for (let i = 0; i < 2; i++) {
            roomId += String.fromCharCode(65 + (Math.floor(Math.random() * 26)));
        }

        for (let i = 0; i < 4; i++) {
            roomId += Math.floor(Math.random() * 10)
        }

        return roomId;
    }

    public static getUsername(): string | null {
        return localStorage.getItem(LOCAL_STORAGE_USER_USERNAME_KEY) ?? null;
    }

    public static setUsername(username: string): void {
        localStorage.setItem(LOCAL_STORAGE_USER_USERNAME_KEY, username);
    }

    public static getUsernameOrRedirect(): string {
        const cachedUsername = this.getUsername();

        if (this.isNullOrUndefined(cachedUsername)) {
            redirect("");
            return "";
        }

        return cachedUsername;
    }

    public static getUserUuid(): string {
        const cachedUuid = localStorage.getItem(LOCAL_STORAGE_USER_UUID_KEY);

        if (this.isNotNullOrUndefined(cachedUuid)) {
            return cachedUuid;
        }

        const newUuid = uuidv4();
        localStorage.setItem(LOCAL_STORAGE_USER_UUID_KEY, newUuid);

        return newUuid;
    }

    public static getOrderedPlayers(players: TPlayer[], playerGuid: string) {
        const indexSelfGuid = players.findIndex(x => x.guid === playerGuid);

        if (indexSelfGuid === -1) {
            return players;
        }

        const ordered = [];
        ordered.push(players[indexSelfGuid]);

        for (let i = 0; i < indexSelfGuid; i++) {
            ordered.push(players[i]);
        }

        for (let i = indexSelfGuid + 1; i < players.length; i++) {
            ordered.push(players[i]);
        }

        return ordered;
    }

    public static GetWithoutElementAt<T>(array: T[], index: number): T[] {
        const newArray = [...array];

        newArray.splice(index, 1);

        return newArray;
    }

    public static delay(time: number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}