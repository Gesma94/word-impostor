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
import { Page404 } from './routes/Page404/Page404';
import { ROUTES } from './common/constants';

render(() => (
    <Router>
        <Route path="" component={LayoutWrapper}>
            <Route path={ROUTES.HOME} component={Home} />
            <Route path={ROUTES.JOIN_ROOM} component={JoinRoom} />
            <Route path={ROUTES.CREATE_ROOM} component={CreateRoom} />
            <Route path={ROUTES.ROOM_MASTER()} component={RoomMaster} />
            <Route path={ROUTES.ROOM_PLAYER()} component={RoomPlayer} />
        </Route>
        <Route path={ROUTES.ERROR} component={Error} />
        <Route path={ROUTES.PICK_USERNAME} component={PickUsername} />
        <Route path="*" component={Page404} />
    </Router>
), document.getElementById('root')!);
