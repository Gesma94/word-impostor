import { A, useLocation, useNavigate } from "@solidjs/router";
import { For, JSX } from "solid-js";
import Utils from "../../common/Utils";
import { TbFeather } from "solid-icons/tb";
import { ROUTES } from "src/common/constants";
import { SharedUtils } from "@shared/utils/SharedUtils";

type TTopbarLink = { href: string; text: string; }

export const Topbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const getLinks = () => {
        const baseLink : TTopbarLink[] = [
            { href: ROUTES.HOME, text: 'Home' },
            { href: ROUTES.JOIN_ROOM, text: 'Join Room' },
            { href: ROUTES.CREATE_ROOM, text: 'Create Room' }
        ];
        
        const regexResult = /^\/room\/([A-Z]{2}[0-9]{1})\/(master|player)/.exec(location.pathname);

        if (SharedUtils.isNotNullOrUndefined(regexResult) && SharedUtils.isNotNullOrUndefined(regexResult[1])) {
            baseLink.push({ href: location.pathname, text: `Room ${regexResult[1]}` });
        }

        return baseLink;
    }

    const getCssClasses = (href: string): string => {
        let classes = "h-full w-[120px] flex items-center justify-center text-white";

        if (location.pathname === href) {
            classes += " bg-gradient-to-b from-transparent from-0% via-transparent via-90% to-red to-90%";
        }

        return classes;
    }

    const handleChangeUsernameClick: JSX.EventHandler<HTMLSpanElement, MouseEvent> = () => {
        navigate(ROUTES.PICK_USERNAME);
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