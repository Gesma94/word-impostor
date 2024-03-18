import { Router } from "express";
import { roomStore } from "../storage/roomStore";
import { SharedUtils } from "@shared/utils/SharedUtils";

type TGetExistsParams = {
    roomId: string;
}

type TCreateRoomQueryParams = {
    ['master-uuid']: string;
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

    if (SharedUtils.isNullOrUndefined(roomId) || !roomStore.hasRoom(roomId)) {
        response.sendStatus(400);
        return;
    }

    response.sendStatus(200);
});

roomRouter.get<string, unknown, unknown, unknown, TCreateRoomQueryParams>('/create', (request, response) => {

    const masterUuid = request.query['master-uuid'];

    if (SharedUtils.isNullOrUndefined(masterUuid) || masterUuid === '') {
        response.sendStatus(400);
        return;
    }
    
    const newRoom = roomStore.createRoom(request.query["master-uuid"]);

    if (SharedUtils.isNullOrUndefined(newRoom)) {
        response.sendStatus(400);
        return;
    }

    response.status(200).send(newRoom.roomId);
});

roomRouter.get<string, THasPermissionRoomParams, unknown, unknown, THasPermissionRoomQueryParams>('/:roomId/has-permission', (request, response) => {
    const roomId = request.params.roomId;
    const masterUuid = request.query.masterUuid;

    if (SharedUtils.isNullOrUndefined(masterUuid) || SharedUtils.isNullOrUndefined(roomId)) {
        response.sendStatus(400);
        return;
    }

    const room = roomStore.get(roomId);

    if (SharedUtils.isNullOrUndefined(room)) {
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