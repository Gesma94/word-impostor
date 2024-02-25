import { Room } from "./room";

class RoomStore {
    private _rooms = new Map<string, Room>();

    public get(roomId: string): Room | null {
        return this._rooms.get(roomId) ?? null;
    }

    public delete(roomId: string): boolean {
        return this._rooms.delete(roomId);
    }

    public hasRoom(roomId: string): boolean {
        return this._rooms.has(roomId);
    }

    public hasRoomPermission(roomId: string, userUuid: string): boolean {
        const room = this._rooms.get(roomId);

        if (room !== undefined && room.masterUuid === userUuid) {
            return true;
        }

        return false;
    }

    public createRoom(masterUuid: string): Room | null {
        const roomId = this.generateRoomId();

        if (this._rooms.has(roomId)) {
            return null;
        }

        const newRoom = new Room(roomId, masterUuid, this.delete);
        this._rooms.set(roomId, newRoom);

        return newRoom;
    }

    public getByConnectionUuid(connectionUuid: string) {
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
