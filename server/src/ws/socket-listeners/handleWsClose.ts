import { TWsMasterLeftRoomMessage, TWsPlayerLeftRoomMessage } from "@shared/types/WebSocketTypes";
import { Room } from "../../storage/room";
import { roomStore } from "../../storage/roomStore";
import { WS_MSG_EVENTS_CONST } from "@shared/constants/WebSocket";
import { SharedUtils } from "@shared/utils/SharedUtils";

export function handleWsClose(userConnectionUuid: string) {
    const roomsWithUser = roomStore.getByConnectionUuid(userConnectionUuid);

    roomsWithUser.forEach(room => {
        handleMasterLeave(userConnectionUuid, room);
        handlePlayerLeave(userConnectionUuid, room);
    });
}

function handleMasterLeave(userConnectionUuid: string, room: Room) {
    const indexInMasterConnections = room.masterConnections
        .findIndex(x => x.connectionUuid === userConnectionUuid);

    // Returning right away if the connection is not in the master ones
    if (indexInMasterConnections === -1) {
        return;
    }

    // Removing the connection
    room.masterConnections.splice(indexInMasterConnections, 1);
    
    // Returning right away if the master is still connected from other WS session
    if (room.masterConnections.length > 0) {
        return;
    }

    // Otherwise, notifying all players and creating a remove callback
    const message: TWsMasterLeftRoomMessage = {
        event: WS_MSG_EVENTS_CONST.MASTER_LEFT_ROOM,
        payload: {}
    }

    room.sendToAllPlayers(message);
    room.startRemoverCallbackTimeout();
}

function handlePlayerLeave(userConnectionUuid: string, room: Room) {
    const leavingPlayer = room.getPlayerByConnection(userConnectionUuid);

     // Returning right away if the user is not a player
     if (SharedUtils.isNullOrUndefined(leavingPlayer)) {
        return;
    }

    const indexInConnections = leavingPlayer.connections.findIndex(x => x.connectionUuid === userConnectionUuid);

    // Returning right away if the current connection is not for the leaving player
    if (indexInConnections === -1) {
        return;
    }

    // Removing the connection
    leavingPlayer.connections.splice(indexInConnections, 1);

    // Returning right away if the player is still connected from other WS session
    if (leavingPlayer.connections.length > 0) {
        return;
    }

    // Otherwise, notifying the master and all other players
    const messageToOtherPlayers: TWsPlayerLeftRoomMessage = {
        event: WS_MSG_EVENTS_CONST.PLAYER_LEFT_ROOM,
        payload: { playerUuid: leavingPlayer.uuid }
    }

    room.sendToMaster(messageToOtherPlayers);    
    room.sendToAllPlayers(messageToOtherPlayers);    

    // Finally, deleting the player from the room
    delete room.players[leavingPlayer.uuid];
}