import { randomUUID } from 'crypto';
import express, { response } from 'express';
import type { Request, Response } from "express";
import { Database, OPEN_CREATE, OPEN_READWRITE, RunResult, Statement, verbose } from 'sqlite3';
import { Server } from 'ws';
import type { RawData, WebSocket } from 'ws';
import { IWebSocketMessage, IWsPlayerJoinedMessage, IWsRoomStartedMessage, SqliteTableCounter, TRoomStore } from './schemas';
import { WS_MESSAGE_EVENT_CREATE_ROOM, WS_MESSAGE_EVENT_JOIN_ROOM, WS_MESSAGE_EVENT_START_ROOM, WS_MESSAGE_EVENT_PLAYER_JOIN } from './constants';

const app = express();
const port = process.env.PORT || 7717;
const wsServer = new Server({ noServer: true })

const rooms: TRoomStore = {};

wsServer.on('connection', socket => {
    const connectionUuid = randomUUID();

    socket.on('message', (data: RawData, isBinary: boolean) => {
        let  message: IWebSocketMessage;
        
        try {
            message = JSON.parse(data.toString());
        }
        catch (error) {
            console.log(error);
            return;
        }

        switch (message.event) {
            case WS_MESSAGE_EVENT_CREATE_ROOM:
                handleCreateRoom(socket, connectionUuid, message.payload.roomId, message.payload.secretWord, message.payload.impostorWord);
                break;

            case WS_MESSAGE_EVENT_JOIN_ROOM:
                handleJoinRoom(socket, connectionUuid, message.payload.roomId, message.payload.username);
                break;

            case WS_MESSAGE_EVENT_START_ROOM:
                handleStartRoom(socket, connectionUuid, message.payload.roomId);
                break;

            case WS_MESSAGE_EVENT_PLAYER_JOIN:
                // should only happen client side
                break;
        }
    })
});

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

    if (Object.keys(rooms).includes(roomId)) {
        res.sendStatus(500);
    }

    rooms[roomId] = {
        roomId,
        connections: {},
        secretWord,
        impostorWord,
    };

    res.sendStatus(201);

    // await runAsync(getSqliteDb(), `INSERT INTO Rooms(key, id) VALUES(NULL, $roomId)`, { 
    //     $roomId:  req.params['roomId']
    // })
    // .then(_ => res.sendStatus(201))
    // .catch(_ => res.sendStatus(500));
});

const server = app.listen(port, async () => {
    await createTablesAsync();
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
})

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

function handleJoinRoom(webSocket: WebSocket, connectionUuid: string, roomId: string, username: string): void {
    if (!(roomId in rooms)) {
        // throw error
        return;
    }

    if (connectionUuid in rooms[roomId].connections) {
        // throw error
        return;
    }

    // adding user
    rooms[roomId].connections[connectionUuid] = { uuid: connectionUuid, username, socket: webSocket, isAdmin: false }

    // notifying all other users
    const message: IWsPlayerJoinedMessage = {
        event: 'player-joined',
        payload: {
            username: username
        }
    }

    Object.entries(rooms[roomId].connections)
        .filter(x => x[1].uuid !== connectionUuid)
        .forEach(x => x[1].socket.send(JSON.stringify(message)));
}

function handleCreateRoom(socket: WebSocket, connectionId: string, roomId: string, secretWord: string, impostorWord: string) {
    if (roomId in rooms) {
        // throw error
        return;
    }

    rooms[roomId] = {
        roomId,
        secretWord,
        impostorWord,
        connections: {
            [connectionId]: {
                socket,
                isAdmin: true,
                username: null,
                uuid: connectionId,
            }
        },
    }

    // send ok
    return;
}

function handleStartRoom(socket: WebSocket, connectionId: string, roomId: string) {
    if (!(roomId in rooms)) {
        // throw error
        return;
    }

    const room = rooms[roomId];
    const players = Object.values(rooms[roomId].connections);
    const impostorIndex = getImpostorIndex(players.length);

    players.forEach((player, index) => {
        // notifying all other users
        const message: IWsRoomStartedMessage = {
            event: 'room-started',
            payload: {
                roomId: roomId,
                knownWord: ''
            }
        }

        if (index === impostorIndex) {
            message.payload.knownWord = room.impostorWord;
        }
        else {
            message.payload.knownWord = room.secretWord;
        }

        player.socket.send(JSON.stringify(message));
    });
}

function getImpostorIndex(max: number) {
    return Math.floor(Math.random() * max);
}