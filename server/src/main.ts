/** Allows to use the import aliases at runtime */
require('module-alias/register');

import express from 'express';
import { Server } from 'ws';
import roomRouter from './routes/roomRouter';
import cors from 'cors';
import { SharedUtils } from '@shared/utils/SharedUtils';
import { handleConnectionEvent } from './ws/server-listeners/handleConnectionEvent';

/* Creates express application */
const app = express();

/* Defines the port and the base URL for the server */
const port = process.env.PORT || 7717;
const baseUrl = SharedUtils.IsDevEnvironment() ? 'http://localhost' : 'https://wordimpostor.gesma.dev'

/* Creates the WebSocket server */
const wsServer = new Server({ noServer: true });

/* Defines the CORS handler */
const corsHandler = cors({ origin: baseUrl });

/* Sets up the server to listen on the defined port */
const server = app.listen(port, async () => {
    console.log(`[server]: Server is running at ${baseUrl}:${port}`);
});

/* Set the server to listen also for WebSocket messages */
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
})

/* Adds the WebSocket connection event handler */
wsServer.on('connection', handleConnectionEvent);

/* Specifies the usage of the CORS handler */
app.use(corsHandler);

/* Specifies the usage of the room router */
app.use("/room", roomRouter);