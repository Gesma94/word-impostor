import { tv } from "tailwind-variants";

const inputTv = tv({
  base: "py-4 px-3 font-tabular text-white/85 border-b-[1px] border-white/75 outline-none",
  variants: {
    disabled: {
      then: "bg-white/5",
      otherwise: "bg-white/10",
    },
  },
});

export const Input: React.FC<Exclude<React.ComponentProps<"input">, "type">> = props => {
  return <input {...props} className={inputTv({ disabled: props.disabled ? "then" : "otherwise" })} />;
};
