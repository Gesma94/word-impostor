/** Specifies the base URL for API calls */
export const BASE_API_URL = import.meta.env.VITE_SERVER_BASE_URL;

/** Specifies the base URL for WebSocket calls */
export const BASE_WS_URL = import.meta.env.VITE_SERVER_BASE_WS_URL;

/** Object that contains constants related to the local storage */
export const LOCAL_STORAGE_CONST = {
    /** Specifies the local storage key that stores the user uuid */
    USER_UUID_KEY: '__word_impostor_user_uuid__',
    /** Specifies the local storage key that stores the user username */
    USER_USERNAME_KEY: '__word_impostor_user_username__'
} as const;

/** Object that contains constants related to query parameter keys */
export const PARAM_KEY = {
    MASTER_UUID: "master-uuid"
} as const;

export const ROUTES = {
    ROOM: "/room",
    ERROR: "/error",
    ROOM_MASTER: function(roomId: string) {
        return `/${this.ROOM}/${roomId}/master`
    }
} as const;


export const API_ROUTES = {
    CREATE_ROOM: function(userUuid: string) {
        const searchParams = new URLSearchParams();
        searchParams.append(PARAM_KEY.MASTER_UUID, userUuid);

        return `${BASE_API_URL}/room/create?${searchParams.toString()}`;
    }
} as const;