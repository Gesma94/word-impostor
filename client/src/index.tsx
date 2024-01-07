import { render } from 'solid-js/web'
import './index.css'
import { Router, Route } from '@solidjs/router'
import { CreateRoom } from './routes/CreateRoom/CreateRoom';
import { RoomAdmin } from './routes/RoomAdmin/RoomAdmin';
import { RoomPlayer } from './routes/RoomPlayer/RoomPlayer';
import { JoinRoom } from './routes/JoinRoom/JoinRoom';

render(() => (
    <Router>
        <Route path={["/", "/join-room"]} component={JoinRoom} />
        <Route path="/create-room" component={CreateRoom} />
        <Route path="/room/:roomId/admin" component={RoomAdmin} />
        <Route path="/room/:roomId/player" component={RoomPlayer} />
    </Router>
    ), document.getElementById('root')!);
