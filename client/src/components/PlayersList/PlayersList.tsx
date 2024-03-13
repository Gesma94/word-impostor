import { For, Match, Switch } from "solid-js";
import { RiUserFacesUser3Line } from "solid-icons/ri";
import Utils from "../../common/Utils";
import { TPlayer } from "@shared/types/SharedTypes";

type TPlayersList = {
    players: TPlayer[];
}

export const PlayersList = (props: TPlayersList) => {
    return (
        <div class='grid grid-cols-[1fr_1fr]'>
            <For each={props.players}>
                {player => (
                    <li class='flex items-center min-w-0 mt-2'>
                        <RiUserFacesUser3Line />
                        <Switch>
                            <Match when={player.uuid === Utils.getUserUuid()}><span class='pl-2 italic truncate'>(You)</span></Match>
                            <Match when={player.uuid !== Utils.getUserUuid()}><span class='pl-2 truncate'>{player.username}</span></Match>
                        </Switch>
                    </li>
                )}
            </For>
        </div>
    );
}