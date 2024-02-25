import { BiRegularError } from "solid-icons/bi";

export type TTextErrorProps = {
    text: string;
}

export const TextError = (props: TTextErrorProps) => {
    return (
        <span class="flex items-center">
            <BiRegularError class="text-error"/>
            <p class="text-error pl-1 text-sm font-semibold">{props.text}</p>
        </span>
    );
}