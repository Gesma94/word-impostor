import { A, useNavigate } from '@solidjs/router';
import { JSX, createSignal } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { SEARCH_PARAM_KEY_USERNAME, SEARCH_PARAM_KEY_UUID } from '../../common/constants';
import { VsLink } from 'solid-icons/vs';
import { IconUrl } from '../../components/IconUrl/IconUrl';

export const JoinRoom = () => {
    const uuid = uuidv4();
    const navigate = useNavigate();

    const [roomId, setRoomId] = createSignal<string>('');
    const [username, setUsername] = createSignal<string>('');

    const handleSecretWordChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setRoomId(e.currentTarget.value);
    }

    const handleUsernameChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setUsername(e.currentTarget.value);
    }

    const handleJoinRoomClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async (_) => {
        const searchParams = new URLSearchParams();

        searchParams.append(SEARCH_PARAM_KEY_UUID, uuid);
        searchParams.append(SEARCH_PARAM_KEY_USERNAME, username());

        navigate(`/room/${roomId()}?${searchParams.toString()}`);
    }

    return (
        <div class='h-full grid place-content-center'>
            <div class='w-[320px]'>
                <h1>Join room</h1>
                <hr />
                <div class='grid grid-rows-[auto_auto_auto] grid-cols-[auto_1fr] gap-4 py-4'>
                <label for='roomId'>Room ID:</label>
                <input id='roomId' value={roomId()} onInput={handleSecretWordChange} />
                <label for='secretWord'>Username:</label>
                <input id='secretWord' value={username()} onInput={handleUsernameChange} />
                <button class='col-span-2 ' onclick={handleJoinRoomClick}>Join Room</button>
                </div>
                <hr />
                <p>Or, <IconUrl text='create a room' icon={VsLink} url='/create-room' /></p>
            </div>
        </div>
    )
}