import { v4 as uuidv4 } from 'uuid';
import { redirect } from '@solidjs/router';
import { SharedUtils } from '@shared/utils/SharedUtils';
import { TPlayer } from '@shared/types/SharedTypes';
import { LOCAL_STORAGE_CONST, ROUTES } from './constants';

export default class Utils {
    /** Gets the username from the local storage */
    public static getUsername(): string | null {
        return localStorage.getItem(LOCAL_STORAGE_CONST.USER_USERNAME_KEY) ?? null;
    }

    /** Setse the username into the local storage */
    public static setUsername(username: string): void {
        localStorage.setItem(LOCAL_STORAGE_CONST.USER_USERNAME_KEY, username);
    }

    /** Gets the username from the local storage, or redirect to the pick username page */
    public static getUsernameOrRedirect(): string {
        const cachedUsername = this.getUsername();

        if (SharedUtils.isNullOrUndefined(cachedUsername)) {
            redirect(ROUTES.PICK_USERNAME);
            return "";
        }

        return cachedUsername;
    }

    /** Gets the user uuid from the local storage */
    public static getUserUuid(): string {
        const cachedUuid = localStorage.getItem(LOCAL_STORAGE_CONST.USER_UUID_KEY);

        if (SharedUtils.isNotNullOrUndefined(cachedUuid)) {
            return cachedUuid;
        }

        const newUuid = uuidv4();
        localStorage.setItem(LOCAL_STORAGE_CONST.USER_UUID_KEY, newUuid);

        return newUuid;
    }

    /** Returns a deep copy of the players array, but with the local player at first position */
    public static getOrderedPlayers(players: TPlayer[], playerGuid: string) {
        const indexSelfGuid = players.findIndex(x => x.uuid === playerGuid);

        if (indexSelfGuid === -1) {
            return structuredClone(players);
        }

        const ordered = [];
        ordered.push(structuredClone(players[indexSelfGuid]));

        for (let i = 0; i < indexSelfGuid; i++) {
            ordered.push(structuredClone(players[i]));
        }

        for (let i = indexSelfGuid + 1; i < players.length; i++) {
            ordered.push(structuredClone(players[i]));
        }

        return ordered;
    }

    /** Returns {@link array}, but without the element at position {@link index} */
    public static GetWithoutElementAt<T>(array: T[], index: number): T[] {
        const newArray = [...array];

        newArray.splice(index, 1);

        return newArray;
    }

    /** Returns an empty promise that fakes a delay of given {@link milliseconds} */
    public static delay(milliseconds: number): Promise<unknown> {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
}