import { render } from 'solid-js/web'
import './index.css'
import { Router, Route } from '@solidjs/router'
import { Home } from './routes/Home/Home';
import { RoomAdmin } from './routes/RoomAdmin/RoomAdmin';
import { RoomPlayer } from './routes/RoomPlayer/RoomPlayer';

render(() => (
    <Router>
        <Route path="/" component={Home} />
        <Route path="/room/:roomId/admin" component={RoomAdmin} />
        <Route path="/room/:roomId/player" component={RoomPlayer} />
    </Router>
    ), document.getElementById('root')!);
