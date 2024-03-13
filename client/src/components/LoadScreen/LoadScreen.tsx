import { AiOutlineLoading3Quarters } from "solid-icons/ai";
import { ParentProps, Show } from "solid-js";
import { SharedUtils } from "@shared/utils/SharedUtils";

export type TLoadScreenProps = {
    isVisible: boolean;
    message?: string;
}

export const LoadScreen = (props: ParentProps<TLoadScreenProps>) => {
    return (
        <Show when={props.isVisible}>
            <div class="fixed top-0 left-0 h-lvh w-lvw grid place-content-center bg-overlay z-[1]">
                <div class="bg-white p-8 text-center">
                    <span class="flex place-content-center animate-spin">
                        <AiOutlineLoading3Quarters />
                    </span>
                    <Show when={SharedUtils.isNotNullOrUndefined(props.children)}>
                        {props.children}
                    </Show>
                    <Show when={SharedUtils.isNullOrUndefined(props.children)}>
                        <p class="mt-2">{props.message}</p>
                    </Show>
                </div>
            </div>
        </Show>
    );
}