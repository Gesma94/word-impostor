import { render } from 'solid-js/web'
import './index.css'
import { Router, Route, Navigate } from '@solidjs/router'
import { CreateRoom, CreateRoomWithoutId } from './routes/CreateRoom/CreateRoom';
import { Room } from './routes/Room/Room';
import { JoinRoom } from './routes/JoinRoom/JoinRoom';

render(() => (
    <Router>
        <Route path="/join-room" component={JoinRoom} />
        <Route path="/create-room" component={CreateRoomWithoutId} />
        <Route path="/create-room/:roomId" component={CreateRoom} />
        <Route path="/room/:roomId/" component={Room} />
        <Route path="/" component={() => <Navigate href={'create-room'} />} />
    </Router>
    ), document.getElementById('root')!);
