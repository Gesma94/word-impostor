import { useParams, useSearchParams } from '@solidjs/router';
import type { JSX } from 'solid-js'
import { For, Show, createSignal, onMount } from 'solid-js'
import { TRoomParams, TRoomSearchParams } from './RoomAdmin.schemas';
import { IWebSocketMessage, IWsCreateRoomMessage, IWsStartRoomMessage } from 'word-impostor-common/src/schemas';
import { WS_MESSAGE_EVENT_PLAYER_JOIN } from 'word-impostor-common/src/constants';


export const RoomAdmin = () => {
    let webSocket : WebSocket;

    const params = useParams<TRoomParams>();
    const [searchParams, _] = useSearchParams<TRoomSearchParams>();

    const secretWord = searchParams.secretWord;
    const impostorWord = searchParams.impostorWord;

    const [playersInRoom, setPlayersInRoom] = createSignal<string[]>([]);

  const handleStartGameClick : JSX.EventHandler<HTMLButtonElement, MouseEvent> = (_) => {    
    const wsEventStartRoom : IWsStartRoomMessage = {
      event: 'start-room',
      payload: { roomId: params.roomId }
    }

    webSocket.send(JSON.stringify(wsEventStartRoom));    
  }

  const handleMessage = (e: MessageEvent) => {
    const message : IWebSocketMessage = JSON.parse(e.data);

    switch (message.event) {
      case WS_MESSAGE_EVENT_PLAYER_JOIN:
        handlePlayerJoin(message.payload.username);
        break;
    }
  }
  

const handlePlayerJoin = (username: string) => {
  setPlayersInRoom(prev => [...prev, username]);
}



  const handleOpenWsConnection = (_: Event) => {
    if (!secretWord || !impostorWord) {
      return <p>"error"</p>
    }

    const wsEventCreateRoom : IWsCreateRoomMessage = {
      event: 'create-room',
      payload: {
        secretWord,
        impostorWord,
        roomId: params.roomId
      }
    }

    webSocket.send(JSON.stringify(wsEventCreateRoom));    
}

  onMount(async () => {
    if (!secretWord || !impostorWord) {
      return <p>"error"</p>
    }

    
    let a = import.meta.env.VITE_SERVER_BASE_WS_URL;
    webSocket = new WebSocket(a);
webSocket.addEventListener('open', handleOpenWsConnection);
  
    webSocket.addEventListener('message', handleMessage);
  });  

  return (
    <div class='h-full grid place-content-center'>
      <div class='w-[320px]'>
        <h1>{params.roomId}</h1>
        <hr />
        <p>{playersInRoom().length} players</p>
        <For each={playersInRoom()}>
            {player => <p>{player}</p>}
        </For>
        <button onclick={handleStartGameClick}>Start Game</button>
        <Show when={secretWord !== null}>
            <p>Your secret word is {secretWord}</p>
        </Show>
      </div>
    </div>
  )
}