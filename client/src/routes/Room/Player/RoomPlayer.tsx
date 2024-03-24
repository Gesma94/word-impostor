import { A, useNavigate, useParams } from '@solidjs/router';
import { JSX, Show, createSignal, onCleanup, onMount } from 'solid-js';
import Utils from '../../../common/Utils';
import { LoadScreen } from '../../../components/LoadScreen/LoadScreen';
import { IconUrl } from '../../../components/IconUrl/IconUrl';
import { VsLink } from 'solid-icons/vs';
import { PlayersList } from '../../../components/PlayersList/PlayersList';
import { useBusyContent } from '../../../signals/useBusyContent';
import { SecretWord } from '../../../components/SecretWord/SecretWord';
import { SharedUtils } from '@shared/utils/SharedUtils';
import { TPlayer } from '@shared/types/SharedTypes';
import { TWebSocketMessage, TWsPlayerJoinRoomMessage, TWsPlayerJoinRoomResponsePayload, TWsPlayerJoinedRoomPayload, TWsPlayerLeftRoomPayload, TWsRoundStartedPayload } from '@shared/types/WebSocketTypes';
import { WS_MSG_EVENTS_CONST } from '@shared/constants/WebSocket';

type TRoomPlayerParams = {
    roomId: string;
}

export const RoomPlayer = () => {
    let webSocket: WebSocket;

    const navigate = useNavigate();
    const params = useParams<TRoomPlayerParams>();

    const [players, setPlayers] = createSignal<TPlayer[]>([]);
    const [impostorHasHint, setImpostorHasHint] = createSignal(false);
    const [knownWord, setKnownWord] = createSignal<string | null>(null);
    const [isShowingRoom, setIsShowingRoom] = createSignal<boolean>(true);
    const [ isBusy, _, setBusy, setNotBusy ] = useBusyContent(false, '');
    const [currentRound, setCurrentRound] = createSignal<number | null>(null);

    const orderedPlayers = () => Utils.getOrderedPlayers(players(), Utils.getUserUuid());

    const handleShowRoomClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
        setIsShowingRoom(true);
    }

    const handleShowPlayersClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
        setIsShowingRoom(false);
    }

    const handleWsError = (_: Event) => {
        navigate('/error');
    }

    const handleWsOpen = (_: Event) => {
        if (SharedUtils.isNullOrUndefined(params.roomId)) {
            navigate('/error');
        }

        const wsEventCreateRoom: TWsPlayerJoinRoomMessage = {
            event: WS_MSG_EVENTS_CONST.PLAYER_JOIN_ROOM,
            payload: {
                roomId: params.roomId,
                playerUuid: Utils.getUserUuid(),
                username: Utils.getUsernameOrRedirect()
            }
        }

        webSocket.send(JSON.stringify(wsEventCreateRoom));
    }

    const handleWsMessage = (e: MessageEvent) => {
        const message: TWebSocketMessage = JSON.parse(e.data);

        switch (message.event) {
            case WS_MSG_EVENTS_CONST.PLAYER_JOIN_ROOM_RESPONSE:
                handleWsPlayerJoinResponse(message.payload);
                break;
            case WS_MSG_EVENTS_CONST.PLAYER_JOINED_ROOM:
                handleWsPlayerJoinedRoom(message.payload);
                break;
            case WS_MSG_EVENTS_CONST.PLAYER_LEFT_ROOM:
                handleWsPlayerLeft(message.payload);
                break;
            case WS_MSG_EVENTS_CONST.MASTER_LEFT_ROOM:
                handleWsMasterLeft(message.payload);
                break;
            case WS_MSG_EVENTS_CONST.MASTER_JOINED_ROOM:
                handleWsMasterJoined(message.payload);
                break;
            case WS_MSG_EVENTS_CONST.ROUND_STARTED:
                handleWsRoundStarted(message.payload);            
                break;
        }
    }

    const handleWsPlayerJoinResponse = (payload: TWsPlayerJoinRoomResponsePayload) => {
        const newPlayers: TPlayer[] = payload.players.map(x => ({ uuid: x.uuid, username: x.username }));
        setPlayers(newPlayers);

        if (!payload.hasStarted) {
            return;
        }
         
        setCurrentRound(payload.currentRound);

        if (payload.playerWord !== undefined) {
            setKnownWord(payload.playerWord);
            setImpostorHasHint(payload.impostorHasHint);
        }
    }

    const handleWsPlayerJoinedRoom = (payload: TWsPlayerJoinedRoomPayload) => {
        setPlayers(curr => [...curr, { uuid: payload.playerUuid, username: payload.username }]);
    }

    const handleWsPlayerLeft = (payload: TWsPlayerLeftRoomPayload) => {
        setPlayers(curr => {
            const indexToRemove = curr.findIndex(x => x.uuid === payload.playerUuid);
            return (indexToRemove !== -1)
                ? Utils.GetWithoutElementAt(curr, indexToRemove)
                : curr;
        })
    }

    const handleWsMasterLeft = (_: {}) => {
        setBusy('');
    }

    const handleWsMasterJoined = (_: {}) => {
        setNotBusy();
    }
    
    const handleWsRoundStarted = (payload: TWsRoundStartedPayload) => {
        setCurrentRound(payload.round);
        setKnownWord(payload.knownWord);
        setImpostorHasHint(payload.impostorHint);

        setIsShowingRoom(true);
    }

    onMount(() => {
        const wsUrl = import.meta.env.VITE_SERVER_BASE_WS_URL;

        webSocket = new WebSocket(wsUrl);

        webSocket.addEventListener('open', handleWsOpen);
        webSocket.addEventListener('error', handleWsError);
        webSocket.addEventListener('message', handleWsMessage);
    });

    onCleanup(() => {
        if (SharedUtils.isNullOrUndefined(webSocket)) {
            return;
        }

        webSocket.close();

        webSocket.removeEventListener('open', handleWsOpen);
        webSocket.removeEventListener('error', handleWsError);
        webSocket.removeEventListener('message', handleWsMessage);
    });


    return (
        <>
            <LoadScreen isVisible={isBusy()}>
                <p class="mt-2">Master has left. Wait for his return or,</p>
                <div class="mt-2">
                <A href='/'>Return to Homepage</A>
                </div>
            </LoadScreen>
            <div class='h-full grid place-content-center'>
                <div class='w-[320px] min-h-0 h-[420px]'>
                    <div class='py-4'>
                        <Show when={currentRound() === null}><h1>Room {params.roomId}</h1></Show>
                        <Show when={currentRound() !== null}><h1>Room {params.roomId} - Round {currentRound()}</h1></Show>
                        <p class='text-center text-xs font-semibold my-2'>{players().length} player(s) connected</p>
                        <div class='grid grid-rows-[auto] grid-cols-[auto_auto] justify-evenly py-2'>
                            <button class='w-[120px] h-[32px] text-xs' onClick={handleShowRoomClick}>Show Room</button>
                            <button class='w-[120px] h-[32px] text-xs' onClick={handleShowPlayersClick}>Show Players</button>
                        </div>
                        <hr />
                        <Show when={isShowingRoom()}>
                            <div class='h-[200px] overflow-y-auto'>
                                <Show when={SharedUtils.isNotNullOrUndefined(knownWord())}>
                                    <p class='text-center'>
                                        You have your secret word!
                                        <br />
                                        <br />
                                        Click on the button to see it, but don't show it to the other players!
                                    </p>
                                    <div class='flex m-2 justify-center'>
                                        <SecretWord secretWord={knownWord() ?? ''} />
                                    </div>
                                    <Show when={impostorHasHint()}>
                                        <p class='text-center'><b>Beaware! You're the impostor!</b></p>
                                    </Show>
                                </Show>
                                <Show when={!SharedUtils.isNotNullOrUndefined(knownWord())}>
                                    <p class='text-center'>Wait for the master to start the game!</p>
                                    <br />
                                    <p class='text-center'>In the meanwhile, you can look at the other players by clicking on Show Players</p>
                                </Show>
                            </div>
                        </Show>
                        <Show when={!isShowingRoom()}>
                            <div class='h-[200px] overflow-y-auto'>
                                <PlayersList players={orderedPlayers()} />
                            </div>
                        </Show>
                        <hr />
                        <p>Or, <IconUrl text='Join another room' icon={VsLink} url='/join-room' /></p>
                    </div>
                </div>
            </div>
        </>
    )
}
