import { A } from '@solidjs/router';
import { ROUTES } from 'src/common/constants';

export const Home = () => {
    return (
        <div class='h-full bg-white grid place-content-center gap-4'>
            <h1 class='small:text-6xl text-center text-textColor top-100 relative -top-8 text-8xl'>Word<br />Impostor</h1>
            <span class='flex m-auto'><A href={ROUTES.CREATE_ROOM}><button class='w-[160px]'>Create Room</button></A></span>
            <span class='flex m-auto'><A href={ROUTES.JOIN_ROOM}><button class='w-[160px]'>Join Room</button></A></span>
        </div>
    )
}