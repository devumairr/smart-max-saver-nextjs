import { FC, ReactElement, useMemo } from "react";

const Button: FC<IButton & ExtendStyles> = ({
  text,
  variant,
  extraClasses = "",
  endIcon,
  ...rest
}): ReactElement => {
  const getVariantClasses: string = useMemo(() => {
    switch (variant) {
      case "contained-pill":
        return "bg-white text-black hover:bg-primary hover:text-white rounded-full";
      case "contained-pill-white":
        return "bg-black text-white hover:bg-primary rounded-full";
      case "contained-square-white":
        return "bg-white text-black hover:bg-primary hover:text-white";
      case "gradient":
        return "bg-gradient-to-t from-[#3aa943] to-[#649533] text-white !font-bold !text-sm !px-8 !py-5 border-b-4 border-b-green-700 hover:bg-gradient-to-r hover:from-[#84c741] hover:to-[#3aa943] rounded-lg";
      default:
        return "";
    }
  }, [variant]);

  const endIconClasses = useMemo(() => {
    return endIcon ? "flex justify-between items-center gap-3" : "";
  }, [endIcon]);

  return (
    <button
      className={`${getVariantClasses}  ${endIconClasses} text-xs px-5 py-1.5 transition-all ease-in-out duration-300 ${extraClasses}`}
      {...rest}
    >
      {text}
      {endIcon}
    </button>
  );
};

export default Button;
