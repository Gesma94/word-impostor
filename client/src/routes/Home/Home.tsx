import { useNavigate } from '@solidjs/router';
import type { JSX } from 'solid-js'
import { createSignal } from 'solid-js'

function generateRoomId() {
    let roomId = '';

    for (let i=0; i<2; i++) {
        roomId += String.fromCharCode(65 + (Math.floor(Math.random() * 26)));
    }

    for (let i=0; i<4; i++) {
        roomId += Math.floor(Math.random() * 10)
    }

    return roomId;
}

export const Home = () => {
    const navigate = useNavigate();
    const roomId = generateRoomId();

  const [secretWord, setSecretWord] = createSignal('');
  const [impostorWord, setImpostorWord] = createSignal('Impostor');

  const handleSecretWordChange : JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setSecretWord(e.currentTarget.value);
  }

  const handleImpostorWordChange : JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setImpostorWord(e.currentTarget.value);
  }

  const handleCreateRoomClick : JSX.EventHandler<HTMLButtonElement, MouseEvent> = async (_) => {
    navigate(`/room/${roomId}/admin?secretWord=${secretWord()}&impostorWord=${impostorWord()}`);
  }

  return (
    <div class='h-full grid place-content-center'>
      <div class='w-[320px]'>
        <label for='secretWord'>Secret Word:</label>
        <input id='secretWord' value={secretWord()} onInput={handleSecretWordChange} />
        <label for='secretWord'>Impostor Word:</label>
        <input id='secretWord' value={impostorWord()} onInput={handleImpostorWordChange} />
        <button onclick={handleCreateRoomClick}>Create Room</button>
        <hr />
        <p>Or, join an existing room</p>
        {import.meta.env.VITE_SERVER_BASE_URL}
      </div>
    </div>
  )
}
