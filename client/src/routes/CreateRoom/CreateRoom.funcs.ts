/** Returns a random ID for a room in the form of 'XY0000' */
export function generateRoomId() {
    let roomId = '';

    for (let i=0; i<2; i++) {
        roomId += String.fromCharCode(65 + (Math.floor(Math.random() * 26)));
    }

    for (let i=0; i<4; i++) {
        roomId += Math.floor(Math.random() * 10)
    }

    return roomId;
}
