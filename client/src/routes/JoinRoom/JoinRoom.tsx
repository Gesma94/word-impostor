import { A, useNavigate } from '@solidjs/router';
import { JSX, createSignal } from 'solid-js'


export const JoinRoom = () => {
const navigate = useNavigate();

  const [roomId, setRoomId] = createSignal<string>('');
  const [username, setUsername] = createSignal<string>('');


  const handleSecretWordChange : JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setRoomId(e.currentTarget.value);
  }
  
  const handleUsernameChange : JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setUsername(e.currentTarget.value);
  }

  const handleJoinRoomClick : JSX.EventHandler<HTMLButtonElement, MouseEvent> = async (_) => {
    navigate(`/room/${roomId()}/player?username=${username()}&guid=${uuidv4()}`);
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

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, 
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}