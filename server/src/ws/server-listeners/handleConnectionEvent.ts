import { randomUUID } from 'crypto';
import { WebSocket, RawData } from "ws";
import { handleWsClose } from '../socket-listeners/handleWsClose';
import { handleWsMessage } from '../socket-listeners/handleWsMessage';

export function handleConnectionEvent(socket: WebSocket) {
    const connectionUuid = randomUUID();

    socket.on('close', (_: RawData, __: boolean) => handleWsClose(connectionUuid));
    socket.on('message', (rawData: RawData, _: boolean) => handleWsMessage(socket, rawData, connectionUuid));
};