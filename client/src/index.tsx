import { render } from 'solid-js/web'
import './index.css'
import { Router, Route, Navigate } from '@solidjs/router'
import { CreateRoom, CreateRoomWithoutId } from './routes/CreateRoom/CreateRoom';
import { Room } from './routes/Room/Room';
import { JoinRoom } from './routes/JoinRoom/JoinRoom';
import { Home } from './routes/Home/Home';

render(() => (
    <Router>
        <Route path="/join-room" component={JoinRoom} />
        <Route path="/create-room/:roomId" component={CreateRoom} />
        <Route path="/room/:roomId/" component={Room} />
        <Route path="/" component={Home} />
    </Router>
    ), document.getElementById('root')!);
