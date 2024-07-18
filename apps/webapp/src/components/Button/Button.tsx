import { tv, type VariantProps } from "tailwind-variants";

const buttonTv = tv({
  base: "py-4 px-8 font-tabular",
  variants: {
    variant: {
      primary: "text-white bg-white/10",
      secondary: "text-white/70",
    },
  },
});

type Props = VariantProps<typeof buttonTv>;

export const Button: React.FC<Props & React.ComponentProps<"button">> = ({ variant = "primary", ...otherProps }) => {
  return <button {...otherProps} className={buttonTv({ variant })} />;
};
