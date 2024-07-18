import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";
import { tv } from "tailwind-variants";

const toggleTv = tv({
  slots: {
    root: "w-10 h-5 bg-white/10 rounded-2xl border-[1px]",
    thumb: "block w-3 h-3 rounded-full relative transition-all duration-300",
  },
  variants: {
    checked: {
      then: {
        root: "border-white/85",
        thumb: "left-[22px] bg-white",
      },
      otherwise: {
        root: "bg-white/10 border-white/0",
        thumb: "left-[4px] bg-white/70",
      },
    },
  },
});

export const Toggle: React.FC<Exclude<React.ComponentProps<typeof Switch.Root>, "type">> = ({
  checked,
  ...otherProps
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const { root: rootTv, thumb: thumbTv } = toggleTv({ checked: isChecked ? "then" : "otherwise" });

  const handleChange = () => {
    setIsChecked(curr => !curr);
  };

  return (
    <Switch.Root {...otherProps} checked={isChecked} onCheckedChange={handleChange} className={rootTv()}>
      <Switch.SwitchThumb className={thumbTv()} />
    </Switch.Root>
  );
};
