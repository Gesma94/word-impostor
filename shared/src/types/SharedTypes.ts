export type ValueOf<T> = T[keyof T];

/** Specifies basic details of a player */
export type TPlayer = {
    /** Specifies the UUID of the player */
    uuid: string;
    /** Specifies the player username */
    username: string;
}