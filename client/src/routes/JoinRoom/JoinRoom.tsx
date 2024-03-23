import { useNavigate } from '@solidjs/router';
import { JSX, Show, createSignal } from 'solid-js';
import { VsLink } from 'solid-icons/vs';
import { IconUrl } from '../../components/IconUrl/IconUrl';
import { LoadScreen } from '../../components/LoadScreen/LoadScreen';
import { TextError } from '../../components/TextError/TextError';
import Utils from '../../common/Utils';
import { createBusyContent } from '../../signals/useBusyContent';

export const JoinRoom = () => {
    const navigate = useNavigate();

    const [error, setError] = createSignal<string>('');
    const [roomId, setRoomId] = createSignal<string>('');
    const [isBusy, busyContent, setBusy, setNotBusy] = createBusyContent(false, '');

    const handleSecretWordChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setRoomId(e.currentTarget.value);
    }

    const handleJoinRoomFormSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> = async (e) => {
        e.preventDefault();

        const apiUrl = import.meta.env.VITE_SERVER_BASE_URL;

        setError('');
        setBusy(`Connecting to room '${roomId()}'`);

        try {
            const apiResponse = await fetch(`${apiUrl}/room/${roomId()}/exists`);
            await Utils.delay(1000);
            
            if (!apiResponse.ok) {
                setError(`Error while communicating with the server`);
            }

            const apiResult = new Boolean(apiResponse.text());

            if (!apiResult) {
                setError(`Cannot connect to room '${roomId()}'`);
                return;
            }
            
            navigate(`/room/${roomId()}`);
        }
        catch (e) {
            setError(`Error while communicating with the server`);
        }
        finally {
            setNotBusy();
        }
    }

    return (
        <>
            <LoadScreen isVisible={isBusy()} message={busyContent()} />
            <div class='h-full grid place-content-center'>
                <div class='w-[320px] min-h-0'>
                    <div class='py-4'>
                        <h1>Join room</h1>
                        <hr />
                        <form class='grid grid-rows-[auto_auto_auto] grid-cols-[auto_1fr] gap-4 pt-4' onSubmit={handleJoinRoomFormSubmit}>
                            <label for='roomId'>Room ID:</label>
                            <input id='roomId' value={roomId()} onInput={handleSecretWordChange} />
                            <button class='col-span-2' type='submit'>Join Room</button>
                        </form>
                        <Show when={error() !== ''}>
                            <div class='py-1'>
                                <TextError text={error()} />
                            </div>
                        </Show>
                        <hr />
                        <p>Or, <IconUrl text='create a room' icon={VsLink} url='/create-room' /></p>
                    </div>
                </div>
            </div>
        </>
    )
}