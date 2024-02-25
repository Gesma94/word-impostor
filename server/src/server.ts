import { randomUUID } from 'crypto';
import express, { response } from 'express';
import type { Request, Response } from "express";
import { Database, OPEN_CREATE, OPEN_READWRITE, RunResult, Statement } from 'sqlite3';
import { Server } from 'ws';
import type { RawData } from 'ws';
import { SqliteTableCounter, TRoomStore } from './schemas';
import { roomStore } from './storage/roomStore';
import roomRouter from './routes/room';
import cors from 'cors';
import { handleWsClose } from './ws/handleWsClose';
import { handleWsOpen } from './ws/handleWsOpen';
import { handleWsMessage } from './ws/handleWsMessage';

const coras = cors({ origin: 'http://localhost:5173' });
const app = express();
const port = process.env.PORT || 7717;
const wsServer = new Server({ noServer: true });

const server = app.listen(port, async () => {
    await createTablesAsync();
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

app.use(coras);
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

async function createTablesAsync() {
    const rows = await getAsync<SqliteTableCounter>(getSqliteDb(), "SELECT COUNT(*) as counter FROM sqlite_master WHERE type='table'");

    if (rows.counter !== 0) {
        return;
    }

    execAsync(getSqliteDb(), `
        CREATE TABLE Rooms (
            key INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            id TEXT NOT NULL,
            creationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

function getSqliteDb(): Database {
    return new Database('sqlite/db.sqlite', OPEN_CREATE | OPEN_READWRITE);
}

function getAsync<T>(database: Database, sql: string, callback?: (this: Statement, err: Error | null, row: T) => void): Promise<T> {
    return new Promise((resolve, reject) => {

        database.get<T>(sql, (error, rows) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(rows);
            }
        })

        database.close();
    })
}

function execAsync<T>(database: Database, sql: string, callback?: (this: Statement, err: Error | null) => void): Promise<void> {
    return new Promise((resolve, reject) => {
        database.exec(sql, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        })

        database.close();
    })
}

function runAsync<T>(database: Database, sql: string, params: any, callback?: (this: RunResult, err: Error | null) => void): Promise<void> {
    return new Promise((resolve, reject) => {
        database.run(sql, params, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        })

        database.close();
    })
}