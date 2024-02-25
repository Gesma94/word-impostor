import { Router } from "express";
import { roomStore } from "../storage/roomStore";
import Utils from "../Utils";

type TGetExistsParams = {
    roomId: string;
}

type TCreateRoomQueryParams = {
    masterUuid: string;
}

type THasPermissionRoomParams = {
    roomId: string;
}
type THasPermissionRoomQueryParams = {
    masterUuid: string;
}

const roomRouter = Router();

roomRouter.get<TGetExistsParams>('/:roomId/exists', (request, response) => {
    const roomId = request.params.roomId;

    if (Utils.isNullOrUndefined(roomId) || !roomStore.hasRoom(roomId)) {
        response.sendStatus(400);
        return;
    }

    response.sendStatus(200);
});

roomRouter.get<string, unknown, unknown, unknown, TCreateRoomQueryParams>('/create', (request, response) => {

    const masterUuid = request.query.masterUuid;

    if (Utils.isNullOrUndefined(masterUuid) || masterUuid === '') {
        response.sendStatus(400);
    }
    
    const newRoom = roomStore.createRoom(request.query.masterUuid);

    if (Utils.isNullOrUndefined(newRoom)) {
        response.sendStatus(400);
        return;
    }

    response.status(200).send(newRoom.roomId);
});

roomRouter.get<string, THasPermissionRoomParams, unknown, unknown, THasPermissionRoomQueryParams>('/:roomId/has-permission', (request, response) => {
    const roomId = request.params.roomId;
    const masterUuid = request.query.masterUuid;

    if (Utils.isNullOrUndefined(masterUuid) || Utils.isNullOrUndefined(roomId)) {
        response.sendStatus(400);
        return;
    }

    const room = roomStore.get(roomId);

    if (Utils.isNullOrUndefined(room)) {
        response.sendStatus(400);
        return;
    }

    if (room.masterUuid === masterUuid) {
        response.status(200).send();
        return;    
    }

    response.status(403).send();
    return;
});

export default roomRouter;