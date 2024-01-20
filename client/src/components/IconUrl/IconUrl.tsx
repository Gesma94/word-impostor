import { A } from "@solidjs/router";
import { Component } from "solid-js";

export type TIconUrlProps = {
    text: string;
    url: string;
    icon: Component;
}

export const IconUrl = (props: TIconUrlProps) => {
    const Comp = props.icon;

    return (
        <A class="inline-grid grid-flow-col-dense place-items-center gap-1" href={props.url}>
            {props.text}
            <span class='mt-1'>
                <Comp />
            </span>
        </A>
    );
}