export const API_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const WS_MESSAGE_EVENT_CREATE_ROOM = 'create-room';
export const WS_MESSAGE_EVENT_PLAYER_JOIN = 'player-joined';
export const WS_MESSAGE_EVENT_PLAYER_LEFT = 'player-left';
export const WS_MESSAGE_EVENT_ROOM_STARTED = 'room-started';

export const PARAM_KEY_SECRET_WORD = 'secretWord';
export const PARAM_KEY_IMPOSTOR_WORD = 'impostorWord';
export const PARAM_KEY_ARE_RANDOM_WORD = 'areRandomWord';
export const PARAM_KEY_ROOM_RESET_GUID = 'roomResetGuid';
export const PARAM_KEY_IS_MASTER_PLAYING = 'isMasterPlaying';
export const PARAM_KEY_IMPOSTOR_HAS_HINT = 'impostorHasHint';


export const WS_MSG_EVT_START_ROUND = 'WS_MSG_EVT_START_ROUND';
export const WS_MSG_EVT_ROUND_STARTED = 'WS_MSG_EVT_ROUND_STARTED';
export const WS_MSG_EVT_MASTER_JOIN_ROOM = 'WS_MSG_EVT_MASTER_JOIN_ROOM';
export const WS_MSG_EVT_MASTER_IS_PLAYING = 'WS_MSG_EVT_MASTER_IS_PLAYING';
export const WS_MSG_EVT_MASTER_JOINED_ROOM = 'WS_MSG_EVT_MASTER_JOINED_ROOM';
export const WS_MSG_EVT_MASTER_LEFT_ROOM = 'WS_MSG_EVT_MASTER_LEFT_ROOM';
export const WS_MSG_EVT_PLAYER_LEFT_ROOM = 'WS_MSG_EVT_PLAYER_LEFT_ROOM';
export const WS_MSG_EVT_PLAYER_JOIN_ROOM = 'WS_MSG_EVT_PLAYER_JOIN_ROOM';
export const WS_MSG_EVT_PLAYER_JOINED_ROOM = 'WS_MSG_EVT_PLAYER_JOINED_ROOM';
export const WS_MSG_EVT_PLAYER_JOIN_ROOM_RESPONSE = 'WS_MSG_EVT_PLAYER_JOIN_ROOM_RESPONSE';
export const WS_MSG_EVT_MASTER_JOIN_ROOM_RESPONSE = 'WS_MSG_EVT_MASTER_JOIN_ROOM_RESPONSE';

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
