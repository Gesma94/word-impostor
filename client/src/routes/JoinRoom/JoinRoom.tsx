import { A, useNavigate } from '@solidjs/router';
import { JSX, createSignal } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { SEARCH_PARAM_KEY_USERNAME, SEARCH_PARAM_KEY_UUID } from '../../common/constants';

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
                <label for='roomId'>Room ID:</label>
                <input id='roomId' value={roomId()} onInput={handleSecretWordChange} />
                <label for='secretWord'>Username:</label>
                <input id='secretWord' value={username()} onInput={handleUsernameChange} />
                <button onclick={handleJoinRoomClick}>Join Room</button>
                <hr />
                <p>Or, <A href='/create-room'>create a room</A></p>
            </div>
        </div>
    )
}