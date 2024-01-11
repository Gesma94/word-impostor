import { render } from 'solid-js/web'
import './index.css'
import { Router, Route, Navigate } from '@solidjs/router'
import { CreateRoom, CreateRoomWithoutId } from './routes/CreateRoom/CreateRoom';
import { RoomAdmin } from './routes/RoomAdmin/RoomAdmin';
import { RoomPlayer } from './routes/RoomPlayer/RoomPlayer';
import { JoinRoom } from './routes/JoinRoom/JoinRoom';

render(() => (
    <Router>
        <Route path="/join-room" component={JoinRoom} />
        <Route path="/create-room" component={CreateRoomWithoutId} />
        <Route path="/create-room/:roomId" component={CreateRoom} />
        <Route path="/room/:roomId/admin" component={RoomAdmin} />
        <Route path="/room/:roomId/player" component={RoomPlayer} />
        <Route path="/" component={() => <Navigate href={'create-room'} />} />
    </Router>
    ), document.getElementById('root')!);
