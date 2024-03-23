import { Room } from "./room";

/** Specifies a class that acts like a storage for {@link Room} */
class RoomStore {
    private _rooms = new Map<string, Room>();

    /** Returns the room identified by {@link roomId}, or `null` if it does not exists */
    public get(roomId: string): Room | null {
        return this._rooms.get(roomId) ?? null;
    }

    /** Deletes, if exists, the room identified by {@link roomId}, and returns `true` if the room was actually deleted */
    public delete(roomId: string): boolean {
        return this._rooms.delete(roomId);
    }

    /** Returns `true` if the store contains the room identified by {@link roomId} */
    public hasRoom(roomId: string): boolean {
        return this._rooms.has(roomId);
    }

    /** Returns `true` if the user identified by {@link userUuid} has master permission over the room identified by {@link roomId} */
    public hasMasterPermission(roomId: string, userUuid: string): boolean {
        const room = this._rooms.get(roomId);

        if (room !== undefined && room.masterUuid === userUuid) {
            return true;
        }

        return false;
    }

    /** Creates a new room with the master permission assigned to the user 
     * identified by {@link masterUuid}; returns the new room, or `null` if the room was not created 
     */
    public createRoom(masterUuid: string): Room | null {
        const roomId = this.generateRoomId();

        if (this._rooms.has(roomId)) {
            return null;
        }

        const newRoom = new Room(roomId, masterUuid, this.delete);
        this._rooms.set(roomId, newRoom);

        return newRoom;
    }

    /** Returns all the rooms where the {@link connectionUuid} is connected to, both as a player and as a master */
    public getByConnectionUuid(connectionUuid: string): Room[] {
        const rooms : Room[] = [];
        
        for (let room of this._rooms.values()) {
            if (room.masterConnections.some(x => x.connectionUuid === connectionUuid)) {
                rooms.push(room);
                continue;
            }

            for (let player of Object.values(room.players)) {
                if (player.connections.some(x => x.connectionUuid === connectionUuid)) {
                    rooms.push(room);
                    continue;
                }
            }
        }

        return rooms;
    }


    private generateRoomId(): string {
        let isValid = false;
        
        while (!isValid) {
            let roomId = '';

            for (let i=0; i<2; i++) {
                roomId += String.fromCharCode(65 + (Math.floor(Math.random() * 26)));
            }

            for (let i=0; i<1; i++) {
                roomId += Math.floor(Math.random() * 10)
            }

            if (!this._rooms.has(roomId)) {
                return roomId;
            }
        }

        throw new Error();
    }
}

export const roomStore = new RoomStore();
