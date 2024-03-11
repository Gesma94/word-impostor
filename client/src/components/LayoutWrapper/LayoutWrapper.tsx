import { ParentProps, onMount } from "solid-js";
import { Topbar } from "../Topbar/Topbar";
import { useNavigate } from "@solidjs/router";
import SharedUtils from "@shared/utils/Utils";
import Utils from "src/common/Utils";

export const LayoutWrapper = (props: ParentProps) => {
    const navigate = useNavigate(); 

    onMount(() => {
        if (SharedUtils.isNullOrUndefined(Utils.getUsername())) {
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