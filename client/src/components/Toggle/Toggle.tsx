import { JSX } from "solid-js";

type TToggleProps = {
    name: string;
    isChecked: boolean;
    isDisabled?: boolean;
    onChange: (isChecked: boolean) => void;
}

export const Toggle = (props: TToggleProps) => {

    const getSliderCssClasses = (): string => {
        let baseClasses = "w-[18px] h-[18px] absolute left-[3px] top-[2px] transition duration-400 rounded-full";

        if (props.isChecked) {
            baseClasses += " translate-x-[16px] bg-red";
        }
        else {
            baseClasses += " bg-color";
        }
        return baseClasses;
    }

    const handleLabelClick: JSX.EventHandler<HTMLInputElement, InputEvent> = (e): void => {
        props.onChange(e.currentTarget.checked);
    }

    return (
        <label class="h-[22px] w-[40px] box-content inline-block relative rounded-full transition duration-400 bg-inputBg border-inputBorder border-[1px] cursor-pointer has-[:disabled]:bg-disabledInputBg">
            <input type="checkbox" disabled={props.isDisabled} id={props.name} name={props.name} class="invisible" checked={props.isChecked} onInput={handleLabelClick} />
            <span class={getSliderCssClasses()} />
        </label>
    );
}