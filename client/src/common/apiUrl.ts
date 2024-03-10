import Utils from "./Utils";
import { API_URL } from "./constants";

export const PARAM_KEY = {
    MASTER_UUID: "masterUuid"
} as const;

export const API_ROUTES = {
    CREATE_ROOM: function() {
        const searchParams = new URLSearchParams();
        searchParams.append(PARAM_KEY.MASTER_UUID, Utils.getUserUuid());

        return `${API_URL}/room/create?${searchParams.toString()}`;
    }()
} as const;