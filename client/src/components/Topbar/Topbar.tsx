import { A, useLocation, useNavigate } from "@solidjs/router";
import { For, JSX } from "solid-js";
import Utils from "../../common/Utils";
import { TbFeather } from "solid-icons/tb";

export const Topbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isCreateRoom = (): boolean => {
        return (/^\/room\/[A-Z]{2}[0-9]{1}\/master/.test(location.pathname));
    }

    const getLinks = () => {
        return [
            { href: '/', text: 'Home' },
            { href: '/join-room', text: 'Join Room' },
            { href: isCreateRoom() ? location.pathname : '/create-room', text: 'Create Room ' }
        ];
    }

    const getCssClasses = (href: string): string => {
        let classes = "h-full w-[120px] flex items-center justify-center text-white";

        if (location.pathname === href) {
            classes += " bg-gradient-to-b from-transparent from-0% via-transparent via-90% to-red to-90%";
        }

        return classes;
    }

    const handleChangeUsernameClick: JSX.EventHandler<HTMLSpanElement, MouseEvent> = () => {
        navigate('/pick-username');
    }

    return (
        <div class="h-[80px] w-full bg-black">
            <div class='h-full grid grid-cols-[auto_1fr_auto]'>
                <ul class="h-full flex flex-rows col-1">
                    <For each={getLinks()}>
                        {link => (
                            <li class="h-full">
                                <A href={link.href} class={getCssClasses(link.href)}>
                                    <span>{link.text}</span>
                                </A>
                            </li>
                        )}
                    </For>
                </ul>
                <span class='col-start-3 mr-8 flex items-center'>
                    <p class='text-white flex'>
                        <span>Hello, {Utils.getUsername()}</span>
                        <span onClick={handleChangeUsernameClick} class='ml-2 text-xs opacity-75 flex items-center cursor-pointer'>(Change username <span class='mx-1'><TbFeather /></span>)</span>
                    </p>
                </span>
            </div>
        </div>
    );
}