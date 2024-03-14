export const API_URL = import.meta.env.VITE_SERVER_BASE_URL;

/** Object that contains constants related to the local storage */
export const LOCAL_STORAGE_CONST = {
    /** Specifies the local storage key that stores the user uuid */
    USER_UUID_KEY: '__word_impostor_user_uuid__',
    /** Specifies the local storage key that stores the user username */
    USER_USERNAME_KEY: '__word_impostor_user_username__'
} as const;

export const ERROR_ID = {
    CANNOT_CREATE_ROOM: 'cannot-create-room',
} as const;


export const ROUTES = {
    ROOM: "/room",
    ERROR: function(errorId?: string) {
        return errorId === undefined || errorId === null ? '/error' : `/error/${errorId}`
    },
    ROOM_MASTER: function(roomId: string) {
        return `/${this.ROOM}/${roomId}/master`
    }
} as const;
