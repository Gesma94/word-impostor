import { useParams, useSearchParams } from '@solidjs/router';
import { For, Show, createSignal, onMount } from 'solid-js'
import { IWebSocketMessage, IWsJoinRoomMessage } from '../../common/schemas';
import { WS_MESSAGE_EVENT_ROOM_STARTED } from '../../common/constants';

export type TRoomPlayerParams = {
    roomId: string;
}

export type TRoomPlayerSearchParams = {
    guid: string;
    username: string;
}

export const RoomPlayer = () => {
    let webSocket: WebSocket;

    const params = useParams<TRoomPlayerParams>();
    const [searchParams] = useSearchParams<TRoomPlayerSearchParams>();

    const [playersInRoom] = createSignal<string[]>([]);
    const [secretWord, setSecretWord] = createSignal<string | null>(null);


    const handleMessage = (e: MessageEvent) => {
        const message: IWebSocketMessage = JSON.parse(e.data);

        switch (message.event) {
            case WS_MESSAGE_EVENT_ROOM_STARTED:
                handleRoomStarted(message.payload.roomId, message.payload.knownWord);
                break;
        }
    }

    const handleRoomStarted = (roomId: string, knownWord: string) => {
        if (params.roomId !== roomId) {
            // error
        }

        setSecretWord(knownWord);
    }

    const handleOpenWsConnection = (_: Event) => {
        if (!searchParams.username) {
            return <p>"error"</p>
        }


        const wsEventCreateRoom: IWsJoinRoomMessage = {
            event: 'join-room',
            payload: {
                roomId: params.roomId,
                guid: searchParams.guid ?? '',
                username: searchParams.username ?? ''
            }
        }

        webSocket.send(JSON.stringify(wsEventCreateRoom));
    }
    onMount(async () => {
        let a = import.meta.env.VITE_SERVER_BASE_WS_URL;
        webSocket = new WebSocket(a);


        webSocket.addEventListener('message', handleMessage);
        webSocket.addEventListener('open', handleOpenWsConnection);
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
                <Show when={secretWord() !== null}>
                    <p>Your secret word is {secretWord()}</p>
                </Show>
            </div>
        </div>
    )
}
