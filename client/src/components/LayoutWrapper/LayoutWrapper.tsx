import { ParentProps, onMount } from "solid-js";
import { Topbar } from "../Topbar/Topbar";
import Utils from "../../common/Utils";
import { useNavigate } from "@solidjs/router";

export const LayoutWrapper = (props: ParentProps) => {
    const navigate = useNavigate(); 

    onMount(() => {
        if (Utils.isNullOrUndefined(Utils.getUsername())) {
            navigate("/pick-username");
        }
    });

    return (
        <div class="h-full grid grid-rows-[auto_1fr]">
            <div><Topbar /></div>
            <div>{props.children}</div>
        </div>
    );
}