export const API_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const PARAM_KEY_SECRET_WORD = 'secretWord';
export const PARAM_KEY_IMPOSTOR_WORD = 'impostorWord';
export const PARAM_KEY_ARE_RANDOM_WORD = 'areRandomWord';
export const PARAM_KEY_ROOM_RESET_GUID = 'roomResetGuid';
export const PARAM_KEY_IS_MASTER_PLAYING = 'isMasterPlaying';
export const PARAM_KEY_IMPOSTOR_HAS_HINT = 'impostorHasHint';


export const LOCAL_STORAGE_USER_UUID_KEY = '__word_impostor_user_uuid__';
export const LOCAL_STORAGE_USER_USERNAME_KEY = '__word_impostor_user_username__';

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
