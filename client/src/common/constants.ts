import { PARAM_KEY } from "@shared/constants/SharedConstants";
import { SharedUtils } from "@shared/utils/SharedUtils";

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

export const ROUTES = {
    HOME: "/",
    ERROR: "/error",
    JOIN_ROOM: "/join-room",
    CREATE_ROOM: "/create-room",
    PICK_USERNAME: "/pick-username",
    ROOM_PLAYER: function(roomId?: string) {
        return SharedUtils.isNullOrUndefined(roomId) ? '/room/:roomId/player' : `/room/${roomId}/player`
    },
    ROOM_MASTER: function(roomId?: string) {
        return SharedUtils.isNullOrUndefined(roomId) ? '/room/:roomId/master' : `/room/${roomId}/master`
    }
} as const;


export const API_ROUTES = {
    CREATE_ROOM: function(userUuid: string) {
        const searchParams = new URLSearchParams();
        searchParams.append(PARAM_KEY.MASTER_UUID, userUuid);

        return `${BASE_API_URL}/room/create?${searchParams.toString()}`;
    }
} as const;