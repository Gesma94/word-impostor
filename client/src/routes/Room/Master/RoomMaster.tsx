import type { JSX } from 'solid-js'
import { For, Match, Show, Switch, createEffect, createRenderEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { redirect, useNavigate, useParams } from '@solidjs/router';
import { useBusyContent } from '../../../signals/useBusyContent';
import { LoadScreen } from '../../../components/LoadScreen/LoadScreen';
import Utils from '../../../common/Utils';
import { Toggle } from '../../../components/Toggle/Toggle';
import { IconUrl } from '../../../components/IconUrl/IconUrl';
import { VsLink } from 'solid-icons/vs';
import { RiUserFacesUser3Line } from 'solid-icons/ri';
import { SharedUtils } from '@shared/utils/SharedUtils';
import { TPlayer } from '@shared/types/SharedTypes';
import { TWebSocketMessage, TWsMasterIsPlayingMessage, TWsMasterJoinRoomMessage, TWsMasterJoinRoomResponsePayload, TWsPlayerJoinedRoomPayload, TWsPlayerLeftRoomPayload, TWsRoundStartedPayload, TWsStartRoundMessage } from '@shared/types/WebSocketTypes';
import { WS_MSG_EVENTS_CONST } from '@shared/constants/WebSocket';

type TRoomMasterParams = {
    roomId: string;
}

export const RoomMaster = () => {
    let webSocket: WebSocket;
    const navigate = useNavigate();
    const params = useParams<TRoomMasterParams>();

    const [ isBusy, busyContent, setBusy, setNotBusy ] = useBusyContent(false, '');

    const [hasPermissionError] = createSignal(false);
    const [impostorHasHint, setImpostorHasHint] = createSignal(false);
    const [isMasterPlaying, setIsMasterPlaying] = createSignal(false);
    const [areWordsRandom, setAreWordsRandom] = createSignal(false);
    const [isShowingPlayers, setIsShowingPlayers] = createSignal(false);
    const [, setIsShowingRoom] = createSignal(false);
    const [, setIsPlayingStage] = createSignal(false);
    


    const [_, setIsWsOpen] = createSignal(false);
    const [secretWord, setSecretWord] = createSignal('');
    const [currentRound, setCurrentRound] = createSignal(1);
    const [impostorWord, setImpostorWord] = createSignal('');
    const [players, setPlayers] = createSignal<TPlayer[]>([]);
    const [, setWordToPlayWith] = createSignal<string | null>(null);
    const [, setImpostHasHintInRound] = createSignal(false);
    // const [currentRoundMasterPlaying, setCurrentRoundMasterPlaying] = createSignal<boolean>(false);

    const orderedPlayers = () => Utils.getOrderedPlayers(players(), Utils.getUserUuid());

    const roomId = params.roomId;

    const handleSecretWordChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setSecretWord(e.currentTarget.value);
    }

    const handleImpostorWordChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setImpostorWord(e.currentTarget.value);
    }

    const handleShowSettingsClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
        setIsShowingPlayers(false);
        setIsShowingRoom(false);
    }

    
    const handleShowRoomClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
        setIsShowingRoom(true);
    }
    
    const handleStartRoomClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
        setIsPlayingStage(true);
        startRound();
    }

    const startRound = () => {
        const WsStartRoundMessage: TWsStartRoundMessage = {
            event: WS_MSG_EVENTS_CONST.START_ROUND,
            payload: {
                roomId: roomId,
                secretWord: secretWord(),
                impostorWord: impostorWord(),
                areWordsRandom: areWordsRandom(),
                impostorHasHint: impostorHasHint(),
                isMasterPlaying: isMasterPlaying(),
            }
        }

        webSocket.send(JSON.stringify(WsStartRoundMessage));
    }


    const handleShowPlayersClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
        setIsShowingPlayers(true);
    }

    const handleWsPlayerJoin = (payload: TWsPlayerJoinedRoomPayload) => {
        setPlayers(prev => {
            if (prev.findIndex(x => x.uuid === payload.playerUuid) === -1) {
                return [...prev, { uuid: payload.playerUuid, username: payload.username }];
            }

            return prev;
        });
    }

    const handleWsPlayerLeft = (payload: TWsPlayerLeftRoomPayload) => {
        setPlayers(curr => {
            const indexToRemove = curr.findIndex(x => x.uuid === payload.playerUuid);
            return (indexToRemove !== -1)
                ? Utils.GetWithoutElementAt(curr, indexToRemove)
                : curr;
        })
    }

    const handleWsOpen = (_: Event) => {
        setIsWsOpen(true);

        const wsCreateRoomMessage: TWsMasterJoinRoomMessage = {
            event: WS_MSG_EVENTS_CONST.MASTER_JOIN_ROOM,
            payload: {
                roomId: roomId,
                masterUuid: Utils.getUserUuid()
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

    
    const handleWsRoundStarted = (payload: TWsRoundStartedPayload) => {
        setCurrentRound(payload.round);
        setWordToPlayWith(payload.knownWord);
        setImpostHasHintInRound(payload.impostorHint);
    }
    
    const handleWsMasterJoinRoomResponse = (payload: TWsMasterJoinRoomResponsePayload) => {
        setCurrentRound(payload.currentRound);
        setIsPlayingStage(payload.hasStarted);
        setWordToPlayWith(payload.playerWord);
        setPlayers(payload.players);
        // setImpostHasHintInRound(payload);
    }

    const handleWsMessage = (e: MessageEvent) => {
        const message: TWebSocketMessage = JSON.parse(e.data);

        if (message.event === WS_MSG_EVENTS_CONST.PLAYER_JOINED_ROOM) {
            handleWsPlayerJoin(message.payload);
        }
        if (message.event === WS_MSG_EVENTS_CONST.PLAYER_LEFT_ROOM) {
            handleWsPlayerLeft(message.payload);
        }
        if (message.event === WS_MSG_EVENTS_CONST.ROUND_STARTED) {
            handleWsRoundStarted(message.payload);    
        }
        if (message.event === WS_MSG_EVENTS_CONST.MASTER_JOIN_ROOM_RESPONSE) {
            handleWsMasterJoinRoomResponse(message.payload)
        }
    }

    createRenderEffect(() => {
        if (isMasterPlaying()) {
            setAreWordsRandom(true);
        }
    });

    createEffect(() => {
        const isPlaying = isMasterPlaying();

        if (SharedUtils.isNullOrUndefined(webSocket)) {
            redirect('/error');
            return;
        }

        const WsMasterIsPlayingMessage: TWsMasterIsPlayingMessage = {
            event: WS_MSG_EVENTS_CONST.MASTER_IS_PLAYING,
            payload: {
                roomId: roomId,
                isPlaying: isPlaying,
                playerUuid: Utils.getUserUuid(),
                username: Utils.getUsernameOrRedirect()
            }
        }

        webSocket.send(JSON.stringify(WsMasterIsPlayingMessage));
    });

    onMount(async () => {
        setBusy('Checking room permission');

        const searchParams = new URLSearchParams();
        const apiUrl = import.meta.env.VITE_SERVER_BASE_URL;

        searchParams.append("masterUuid", Utils.getUserUuid());

        try {
            const apiResponse = await fetch(`${apiUrl}/room/${roomId}/has-permission?${searchParams.toString()}`);

            if (!apiResponse.ok) {
                navigate('/error');
                return;
            }

            const apiResult = new Boolean(apiResponse.text());

            if (!apiResult) {
                navigate('/error');
                return;
            }
            
            const wsUrl = import.meta.env.VITE_SERVER_BASE_WS_URL;

            webSocket = new WebSocket(wsUrl);

            webSocket.addEventListener('open', handleWsOpen);
            webSocket.addEventListener('error', handleWsError);
            webSocket.addEventListener('close', handleWsClose);
            webSocket.addEventListener('message', handleWsMessage);

            setNotBusy();
        }
        catch (e) {
            navigate('/error');
        }
    });

    onCleanup(() => {
        if (SharedUtils.isNullOrUndefined(webSocket)) {
            return;
        }

        webSocket.close();

        webSocket.removeEventListener('open', handleWsOpen);
        webSocket.removeEventListener('error', handleWsError);
        webSocket.removeEventListener('close', handleWsClose);
        webSocket.removeEventListener('message', handleWsMessage);
    });

    const isStartEnabled = () => players().length >= 2 && (areWordsRandom() || (secretWord() !== '' && impostorWord() !== ''));

    return (
        <>
            <LoadScreen isVisible={isBusy()} message={busyContent()} />
            <Switch>
                <Match when={hasPermissionError()}>
                    <p>permission error</p>
                </Match>
                <Match when={!hasPermissionError()}>
                    <div class='h-full grid place-content-center'>
                        <div class='w-[320px]'>
                            <h1>Room {roomId}</h1>
                            <p class='text-center text-xs font-semibold mt-2'>{players().length} player(s) connected</p>
                            <div class='grid grid-rows-[auto] grid-cols-[auto_auto_auto] justify-evenly py-2 gap-4'>
                                <button class='w-[120px] h-[32px] text-xs' onClick={handleShowSettingsClick}>Show Settings</button>
                                <button class='w-[120px] h-[32px] text-xs' onClick={handleShowPlayersClick}>Show Players</button>
                                <button class='w-[120px] h-[32px] text-xs' onClick={handleShowRoomClick}>Show Room</button>
                            </div>
                            <hr />
                            <div class='relative'>
                                <form class={`${isShowingPlayers() ? 'invisible' : ''}`}>
                                    <div class='grid grid-cols-[auto_1fr] gap-4'>
                                        <label for='masterIsPlaying'>Is Master playing?</label>
                                        <Toggle isChecked={isMasterPlaying()} name={'masterIsPlaying'} onChange={setIsMasterPlaying} />
                                        <label for='impostorHasHint'>Impostor has Hint?</label>
                                        <Toggle isChecked={impostorHasHint()} name={'impostorHasHint'} onChange={setImpostorHasHint} />
                                        <label for='areWordRandom'>Are Word Random?</label>
                                        <Toggle isChecked={areWordsRandom()} name={'areWordRandom'} onChange={setAreWordsRandom} isDisabled={isMasterPlaying()} />
                                    </div>
                                    <div class='grid grid-cols-[auto_1fr] gap-4 pt-4'>
                                        <label for='secretWord'>Secret Word:</label>
                                        <input id='secretWord' name='secretWord' value={secretWord()} disabled={areWordsRandom()} onInput={handleSecretWordChange} />
                                        <label for='impostorWord'>Impostor Word:</label>
                                        <input id='impostorWord' name='impostorWord' value={impostorWord()} disabled={areWordsRandom()} onInput={handleImpostorWordChange} />
                                    </div>
                                </form>
                                <div class={`absolute h-full w-full overflow-y-auto top-0 ${!isShowingPlayers() ? 'invisible' : ''}`}>
                                    <div class='grid grid-cols-[1fr_1fr]'>
                                        <For each={orderedPlayers()}>
                                            {player => (
                                                <li class='flex items-center min-w-0 mt-2'>
                                                    <RiUserFacesUser3Line />
                                                    <Show when={player.uuid === Utils.getUserUuid()}><span class='pl-2 italic'>(You)</span></Show>
                                                    <Show when={player.uuid !== Utils.getUserUuid()}><span class='pl-2 truncate'>{player.username}</span></Show>
                                                </li>
                                            )}
                                        </For>
                                    </div>
                                </div>
                            </div>
                            <button class='w-full mt-4' disabled={!isStartEnabled()} onClick={handleStartRoomClick}>{currentRound() === 0 ? 'Start Room' : 'New Round'}</button>
                            <hr />
                            <p>Or, <IconUrl text='join a room' icon={VsLink} url='/join-room' /></p>
                        </div>
                    </div>
                </Match>
            </Switch>
        </>
    )
}