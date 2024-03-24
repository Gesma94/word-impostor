import { ParentProps, onMount } from "solid-js";
import { Topbar } from "../Topbar/Topbar";
import { useNavigate } from "@solidjs/router";
import Utils from "src/common/Utils";
import { SharedUtils } from "@shared/utils/SharedUtils";
import { ROUTES } from "src/common/constants";

export const LayoutWrapper = (props: ParentProps) => {
    const navigate = useNavigate(); 

    onMount(() => {
        if (SharedUtils.isNullOrUndefined(Utils.getUsername())) {
            navigate(ROUTES.PICK_USERNAME);
        }
    });

    return (
        <div class="h-full grid grid-rows-[auto_1fr]">
            <div><Topbar /></div>
            <div>{props.children}</div>
        </div>
    );
}