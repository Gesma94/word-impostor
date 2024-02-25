import { render } from 'solid-js/web'
import './index.css'
import { Router, Route } from '@solidjs/router'
import { CreateRoom } from './routes/CreateRoom/CreateRoom';
import { JoinRoom } from './routes/JoinRoom/JoinRoom';
import { Home } from './routes/Home/Home';
import { LayoutWrapper } from './components/LayoutWrapper/LayoutWrapper';
import { RoomMaster } from './routes/Room/Master/RoomMaster';
import { Error } from './routes/Error/Error';
import { PickUsername } from './routes/PickUsername/PickUsername';
import { RoomPlayer } from './routes/Room/Player/RoomPlayer';

render(() => (
    <Router>
        <Route path="" component={LayoutWrapper}>
            <Route path="/" component={Home} />
            <Route path="/join-room" component={JoinRoom} />
            <Route path="/room/:roomId/master" component={RoomMaster} />
            <Route path="/create-room" component={CreateRoom} />
            <Route path="/room/:roomId" component={RoomPlayer} />
        </Route>
        <Route path="/pick-username" component={PickUsername} />
        <Route path="*" component={() => <p>404</p>} />
        <Route path="/error/:errorId" component={Error} />
    </Router>
), document.getElementById('root')!);
