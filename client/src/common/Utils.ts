export default class Utils {
    public static isNotNullOrUndefined<T>(value: T): value is NonNullable<T> {
        return value !== undefined && value !== null;
    }
    
    public static isNullOrUndefined(value: unknown): value is null | undefined {
        return value === undefined || value === null;
    }

    public static generateRoomId(): string {
        let roomId = '';

        for (let i=0; i<2; i++) {
            roomId += String.fromCharCode(65 + (Math.floor(Math.random() * 26)));
        }

        for (let i=0; i<4; i++) {
            roomId += Math.floor(Math.random() * 10)
        }

        return roomId;
    }
}