import { A } from '@solidjs/router';
import Utils from '../../common/Utils';

export const Home = () => {
    return (
        <div class='h-full flex flex-col-reverse sm:grid sm:grid-cols-2'>
            <div class='grow bg-white'>
                <div class='sm:h-full grid place-content-center'>
                <A href={`/create-room/${Utils.generateRoomId()}`}><button>Create Room</button></A>
                <A href='/join-room'><button>Join Room</button></A>
                </div>
            </div>
            <div class='grow sm:h-full grid place-content-center bg-red'>
                <h1>Word Impostor</h1>                
            </div>
        </div>
    )
}