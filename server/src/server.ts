require('module-alias/register');

import { randomUUID } from 'crypto';
import express, { response } from 'express';
import type { Request, Response } from "express";
import { Server } from 'ws';
import type { RawData } from 'ws';
import { roomStore } from './storage/roomStore';
import roomRouter from './routes/room';
import cors from 'cors';
import { handleWsClose } from './ws/handleWsClose';
import { handleWsOpen } from './ws/handleWsOpen';
import { handleWsMessage } from './ws/handleWsMessage';
import { SharedUtils } from '@shared/utils/SharedUtils';

console.log(process.env.NODE_ENV);

const app = express();
const port = process.env.PORT || 7717;
const wsServer = new Server({ noServer: true });
const corsHandler = cors({ origin: SharedUtils.IsDevEnvironment() ? 'http://localhost:5173' : 'https://wordimpostor.gesma.dev' });

const server = app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
})

wsServer.on('close', (a: any) => {
    var asd = a;
});

wsServer.on('connection', socket => {
    const connectionUuid = randomUUID();

    socket.on('open', (_: RawData, __: boolean) => handleWsOpen(connectionUuid));
    socket.on('close', (_: RawData, __: boolean) => handleWsClose(connectionUuid));
    socket.on('message', (rawData: RawData, _: boolean) => handleWsMessage(socket, rawData, connectionUuid));
});

app.use(corsHandler);
app.use("/room", roomRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.post('/room/create/:roomId', async (req: Request, res: Response) => {
    const roomId = req.params['roomId'];
    const secretWord = req.body.secretWord;
    const impostorWord = req.body.impostorWord;

    if (roomId === null || roomId === undefined || typeof (roomId) !== 'string') {
        res.sendStatus(500);
    }

    if (Object.keys(roomStore).includes(roomId)) {
        res.sendStatus(500);
    }

    // rooms[roomId] = {
    //     roomId,
    //     connections: {}
    // };

    res.sendStatus(201);

    // await runAsync(getSqliteDb(), `INSERT INTO Rooms(key, id) VALUES(NULL, $roomId)`, { 
    //     $roomId:  req.params['roomId']
    // })
    // .then(_ => res.sendStatus(201))
    // .catch(_ => res.sendStatus(500));
});
