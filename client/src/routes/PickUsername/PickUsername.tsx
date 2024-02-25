import { useNavigate } from "@solidjs/router";
import Utils from "../../common/Utils";
import { JSX, Show, createSignal } from "solid-js";
import { Topbar } from "../../components/Topbar/Topbar";

export const PickUsername = () => {
    const navigate = useNavigate();
    const cachedUsername = Utils.getUsername();

    const [newUsername, setNewUsername] = createSignal<string>('');
    const [username, setUsername] = createSignal<string>(cachedUsername ?? '');

    const handleUsernameChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setUsername(e.currentTarget.value);
    }

    const handleNewUsernameChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setNewUsername(e.currentTarget.value);
    }

    const handleSaveUsernameFormSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> = () => {
        Utils.setUsername(username());
        navigate("/");
    }

    const handleUpdateUsernameFormSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> = () => {
        Utils.setUsername(newUsername());
        navigate("/");
    }

    return (
        <>
            <Show when={Utils.isNullOrUndefined(cachedUsername)}>
                <div class='h-full grid place-content-center'>
                    <div class='w-[320px]'>
                        <h1>Pick Username</h1>
                        <hr />
                        <p class='text-center my-2'>Hello visitor! Please, digit your username.</p>
                        <form onSubmit={handleSaveUsernameFormSubmit} class='grid grid-rows-[auto_auto_auto] grid-cols-[auto_1fr] gap-4 pt-4'>
                            <label for='secretWord'>Username:</label>
                            <input id='secretWord' value={username()} onInput={handleUsernameChange} />
                            <button class='col-span-2' type="submit" disabled={username() === ''}>Apply</button>
                        </form>

                    </div>
                </div>
            </Show>
            <Show when={Utils.isNotNullOrUndefined(cachedUsername)}>
                <div class="h-full grid grid-rows-[auto_1fr]">
                    <div><Topbar /></div>
                    <div>
                        <div class='h-full grid place-content-center'>
                            <div class='w-[320px]'>
                                <h1 class="truncate">Change Username</h1>
                                <hr />
                                <p class='text-center my-2'>Hi <b>{cachedUsername}</b>! Please, digit your new username</p>
                                <form onSubmit={handleUpdateUsernameFormSubmit} class='grid grid-rows-[auto_auto_auto] grid-cols-[auto_1fr] gap-4 pt-4'>
                                    <label for='secretWord'>New Username:</label>
                                    <input id='secretWord' value={newUsername()} onInput={handleNewUsernameChange} />
                                    <button class='col-span-2' type="submit" disabled={newUsername() === ''}>Apply Change</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Show>
        </>
    )
}
