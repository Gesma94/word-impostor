import { useNavigate, useParams, useSearchParams } from '@solidjs/router';
import { For, Show, createSignal, onCleanup, onMount } from 'solid-js'
import { IWebSocketMessage, IWsJoinRoomMessage } from '../../common/schemas';
import { SEARCH_PARAM_KEY_USERNAME, SEARCH_PARAM_KEY_UUID, WS_MESSAGE_EVENT_PLAYER_JOIN, WS_MESSAGE_EVENT_PLAYER_LEFT, WS_MESSAGE_EVENT_ROOM_STARTED } from '../../common/constants';
import { TPlayer } from '../../common/types';
import Utils from '../../common/Utils';

export type TRoomPlayerParams = {
    roomId: string;
}

export type TRoomPlayerSearchParams = {
    [SEARCH_PARAM_KEY_UUID]: string;
    [SEARCH_PARAM_KEY_USERNAME]: string;
}

export const Room = () => {
    let webSocket: WebSocket;
    const navigate = useNavigate();

    const params = useParams<TRoomPlayerParams>();
    const [searchParams] = useSearchParams<TRoomPlayerSearchParams>();

    const [currentRound, setCurrentRound] = createSignal(0);
    const [players, setPlayers] = createSignal<TPlayer[]>([]);
    const [impostorHasHint, setImpostorHasHint] = createSignal(false);
    const [secretWord, setSecretWord] = createSignal<string | null>(null);


    const handleWsMessage = (e: MessageEvent) => {
        const message: IWebSocketMessage = JSON.parse(e.data);

        switch (message.event) {
            case WS_MESSAGE_EVENT_ROOM_STARTED:
                handleWsRoomStarted(message.payload.knownWord, message.payload.round, message.payload.impostorHint);
                break;
            case WS_MESSAGE_EVENT_PLAYER_JOIN:
                handleWsPlayerJoin(message.payload.username, message.payload.guid);
                break;
            case WS_MESSAGE_EVENT_PLAYER_LEFT:
                handleWsPlayerLeave(message.payload.guid);
                break;
        }
    }

    const handleWsPlayerJoin = (username: string, guid: string) => {
        setPlayers(curr => [...curr, { guid, username }]);
    }

    const handleWsPlayerLeave = (guid: string) => {
        setPlayers(curr => {
            const indexToRemove = curr.findIndex(x => x.guid === guid);

            if (indexToRemove !== -1) {
                curr.splice(indexToRemove, 1);
                return [...curr];
            }

            return curr;
        })
    }

    const handleWsRoomStarted = (knownWord: string, round: number, impostorHasHint: boolean) => {
        setCurrentRound(round);
        setSecretWord(knownWord);
        setImpostorHasHint(impostorHasHint);
    }

    const handleWsOpen = (_: Event) => {
        if (Utils.isNullOrUndefined(searchParams[SEARCH_PARAM_KEY_UUID])) {
            navigate('/error');
            return;
        }

        if (Utils.isNullOrUndefined(searchParams[SEARCH_PARAM_KEY_USERNAME])) {
            navigate('/error');
            return;
        }

        const wsEventCreateRoom: IWsJoinRoomMessage = {
            event: 'join-room',
            payload: {
                roomId: params.roomId,
                guid: searchParams[SEARCH_PARAM_KEY_UUID],
                username: searchParams[SEARCH_PARAM_KEY_USERNAME]
            }
        }

        webSocket.send(JSON.stringify(wsEventCreateRoom));
    }

    onMount(() => {
        const wsUrl = import.meta.env.VITE_SERVER_BASE_WS_URL;
        
        webSocket = new WebSocket(wsUrl);

        webSocket.addEventListener('open', handleWsOpen);
        webSocket.addEventListener('message', handleWsMessage);
    });

    onCleanup(() => {
        webSocket?.removeEventListener('open', handleWsOpen);
        webSocket?.removeEventListener('message', handleWsMessage);
    });

    return (
        <div class='h-full grid place-content-center'>
            <div class='w-[320px]'>
                <h1>{params.roomId} - {currentRound() === 0 ? 'Waiting' : `Round ${currentRound()}`}</h1>
                <hr />
                <p>{players().length} players</p>
                <For each={players().filter(x => x.guid !== searchParams[SEARCH_PARAM_KEY_UUID])}>
                    {player => <p>{player.username}</p>}
                </For>
                <Show when={secretWord() !== null}>
                    <p>Your secret word is {secretWord()}</p>
                </Show>
                <Show when={impostorHasHint()}>
                    <p>You are the impostor</p>
                </Show>
            </div>
        </div>
    )
}
