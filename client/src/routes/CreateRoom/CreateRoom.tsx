import type { JSX } from 'solid-js'
import { For, Show, createRenderEffect, createSignal, onMount } from 'solid-js';
import { A, useNavigate, useParams } from '@solidjs/router';
import { IWebSocketMessage, IWsCreateRoomMessage, IWsStartRoomMessage } from '../../common/schemas';
import { TPlayer } from '../../common/types';
import Utils from '../../common/Utils';

type TCreateRoomParams = {
    roomId: string;
}

export const CreateRoom = () => {
    let webSocket: WebSocket;

    const params = useParams<TCreateRoomParams>();

    const [_, setIsWsOpen] = createSignal(false);
    const [secretWord, setSecretWord] = createSignal('');
    const [currentRound, setCurrentRound] = createSignal(0);
    const [impostorWord, setImpostorWord] = createSignal('');
    const [players, setPlayers] = createSignal<TPlayer[]>([]);
    const [wordToPlayWith, setWordToPlayWith] = createSignal('');
    const [areWordsRandom, setAreWordsRandom] = createSignal(false);
    const [impostorHasHint, setImpostorHasHint] = createSignal(false);
    const [isMasterPlaying, setIsMasterPlaying] = createSignal(false);

    const handleSecretWordChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setSecretWord(e.currentTarget.value);
    }

    const handleImpostorWordChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setImpostorWord(e.currentTarget.value);
    }

    const handleImpostorHasHintChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setImpostorHasHint(e.currentTarget.checked);
    }

    const handleIsMasterPlayingChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setIsMasterPlaying(e.currentTarget.value === 'masterIsPlaying');
    }

    const handleAreWordRandomChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setAreWordsRandom(e.currentTarget.value === 'randomWord');
    }

    const handleStartRound: JSX.EventHandler<HTMLFormElement, Event> = (e) => {
        e.preventDefault();

        const wsStartRoomMessage: IWsStartRoomMessage = {
            event: 'start-room',
            payload: {
                roomId: params.roomId,
                secretWord: secretWord(),
                impostorWord: impostorWord(),
                areWordsRandom: areWordsRandom(),
                impostorHasHint: impostorHasHint(),
                isMasterPlaying: isMasterPlaying(),
            }
        }

        webSocket.send(JSON.stringify(wsStartRoomMessage));
    }

    const handleWsPlayerJoin = (guid: string, username: string) => {
        setPlayers(prev => [...prev, { guid, username }]);
    }

    const handleWsPlayerLeave = (guid: string) => {
        setPlayers(prev => {
            const indexToRemove = prev.findIndex(x => x.guid === guid);

            if (indexToRemove !== -1) {
                prev.splice(indexToRemove, 1);
                return [...prev];
            }

            return prev;
        })
    }

    const handleWsRoomStart = (wordToPlayWith: string) => {
        setCurrentRound(prev => prev + 1);
        setWordToPlayWith(wordToPlayWith);
    }

    const handleWsOpen = (_: Event) => {
        setIsWsOpen(true);

        const wsCreateRoomMessage: IWsCreateRoomMessage = {
            event: 'create-room',
            payload: {
                roomId: params.roomId
            }
        }

        webSocket.send(JSON.stringify(wsCreateRoomMessage));
    }

    const handleWsError = (_: Event) => {
        setIsWsOpen(false);
    }

    const handleWsClose = (_: Event) => {
        setIsWsOpen(false);
    }

    const handleWsMessage = (e: MessageEvent) => {
        const message : IWebSocketMessage = JSON.parse(e.data);

        if (message.event === 'player-joined') {
            handleWsPlayerJoin(message.payload.guid, message.payload.username);
        }
        if (message.event === 'player-left') {
            handleWsPlayerLeave(message.payload.guid);
        }
        if (message.event === 'room-started') {
            handleWsRoomStart(message.payload.knownWord)
        }
    }

    createRenderEffect(() => {
        if (isMasterPlaying()) {
            setAreWordsRandom(true);
        }
    });

    onMount(async () => {
        const wsUrl = import.meta.env.VITE_SERVER_BASE_WS_URL;

        webSocket = new WebSocket(wsUrl);

        webSocket.addEventListener('open', handleWsOpen);
        webSocket.addEventListener('error', handleWsError);
        webSocket.addEventListener('close', handleWsClose);
        webSocket.addEventListener('message', handleWsMessage);
    });

    return (
        <div class='h-full grid place-content-center'>
            <div class='w-[320px]'>
                <h1>Room {params.roomId}{currentRound() > 0 ? ` - Round ${currentRound()}` : ''}</h1>
                <form onSubmit={handleStartRound}>
                    <label for='masterIsPlaying'>Master is playing</label>
                    <input
                        type='radio'
                        id='masterIsPlaying'
                        name='masterIsPlaying'
                        value='masterIsPlaying'
                        checked={isMasterPlaying()}
                        onInput={handleIsMasterPlayingChange} />
                    <label for='masterNotPlaying'>Master is not playing</label>
                    <input
                        type='radio'
                        id='masterNotPlaying'
                        name='masterNotPlaying'
                        value='masterNotPlaying'
                        checked={!isMasterPlaying()}
                        onInput={handleIsMasterPlayingChange} />
                    <br />
                    <label for='impostorHint'>Impostor has hint</label>
                    <input
                        type='checkbox'
                        id='impostorHint'
                        name='impostorHint'
                        checked={impostorHasHint()}
                        onInput={handleImpostorHasHintChange} />
                    <br />
                    <label for='randomWord'>Random Word</label>
                    <input
                        type='radio'
                        id='randomWord'
                        name='randomWord'
                        value='randomWord'
                        checked={areWordsRandom()}
                        disabled={isMasterPlaying()}
                        onInput={handleAreWordRandomChange} />
                    <label for='fixedWord'>Fixed Word</label>
                    <input
                        type='radio'
                        id='fixedWord'
                        name='fixedWord'
                        value='fixedWord'
                        checked={!areWordsRandom()}
                        disabled={isMasterPlaying()}
                        onInput={handleAreWordRandomChange} />
                    <br />
                    <label for='secretWord'>Secret Word:</label>
                    <input
                        id='secretWord'
                        name='secretWord'
                        value={secretWord()}
                        disabled={areWordsRandom()}
                        onInput={handleSecretWordChange} />
                    <br />
                    <label for='secretWord'>Impostor Word:</label>
                    <input
                        id='impostorWord'
                        name='impostorWord'
                        value={impostorWord()}
                        disabled={areWordsRandom()}
                        onInput={handleImpostorWordChange} />
                    <br />
                    <button type='submit'>Start Game</button>
                </form>
                <hr />
                <p>{players().length} players</p>
                <For each={players()}>
                    {player => <p>{player.username}</p>}
                </For>
                <hr />
                <Show when={isMasterPlaying()}>
                    <Show when={wordToPlayWith() !== ''}><p>Your word is {wordToPlayWith()}</p></Show>
                    <Show when={wordToPlayWith() === ''}><p>Waiting for your word to play</p></Show>
                </Show>
                <hr />
                <p>Or, <A href='/join-room'>join an existing room</A></p>
            </div>
        </div>
    )
}

export const CreateRoomWithoutId = () => {
    const roomId = Utils.generateRoomId();
    const navigate = useNavigate();

    onMount(() => {
        navigate(`/create-room/${roomId}`);
    });

    return <div>loading</div>
}