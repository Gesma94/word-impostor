import { Router } from "express";
import { roomStore } from "../storage/roomStore";
import { SharedUtils } from "@shared/utils/SharedUtils";
import { PARAM_KEY } from "@shared/constants/SharedConstants";

/** Specifies the path parameters of the GET 'exists' API */
type TGetExistsPathParams = {
    /** Specifies the id of the room */
    roomId: string;
}

/** Specifies the query parameters of the GET 'create' API */
type TGetCreateRoomQueryParams = {
    [PARAM_KEY.MASTER_UUID]: string;
}

/** Specifies the path parameters of the GET 'has-permission' API */
type THasPermissionRoomParams = {
    /** Specifies the id of the room */
    roomId: string;
}
/** Specifies the query parameters of the GET 'has-permission' API */
type THasPermissionRoomQueryParams = {
    [PARAM_KEY.MASTER_UUID]: string;
}

const roomRouter = Router();

/* API that returns '200' if the room identified by 'roomId' already exists */
roomRouter.get<TGetExistsPathParams>('/:roomId/exists', (request, response) => {
    const roomId = request.params.roomId;
    response.status(200).send(SharedUtils.isNullOrUndefined(roomId) || !roomStore.hasRoom(roomId));
});

/* API that returns '200' if the room identified by 'roomId' already exists */
roomRouter.get<string, unknown, unknown, unknown, TGetCreateRoomQueryParams>('/create', (request, response) => {
    const masterUuid = request.query[PARAM_KEY.MASTER_UUID];

    if (SharedUtils.isNullOrUndefined(masterUuid) || masterUuid === '') {
        response.status(400).send('Cannot create a room if its master UUID is null, undefined, or an empty string');
        return;
    }
    
    const newRoom = roomStore.createRoom(masterUuid);

    if (SharedUtils.isNullOrUndefined(newRoom)) {
        response.status(400).send(`Could not create a room with master UUID '${masterUuid}'`);
        return;
    }

    response.status(200).send(newRoom.roomId);
});

/* API that returns '200' if the master identified by 'materUuid' got master permission on the room identified by 'roomId' */
roomRouter.get<string, THasPermissionRoomParams, unknown, unknown, THasPermissionRoomQueryParams>('/:roomId/has-permission', (request, response) => {
    const roomId = request.params.roomId;
    const masterUuid = request.query[PARAM_KEY.MASTER_UUID];

    if (SharedUtils.isNullOrUndefined(masterUuid) || SharedUtils.isNullOrUndefined(roomId)) {
        response.status(400).send('Cannot check permission if master UUID or room ID are null, undefined, or string empty');
        return;
    }

    const room = roomStore.get(roomId);

    if (SharedUtils.isNullOrUndefined(room)) {
        response.status(400).send(`Could not check permission of room ${roomId}`);
        return;
    }

    if (room.masterUuid === masterUuid) {
        response.status(200).send(true);
        return;    
    }

    response.status(200).send(false);
});

export default roomRouter;