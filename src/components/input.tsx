import { FC, ReactElement, useMemo } from "react";

const TextInput: FC<ITextInput & ExtendStyles> = ({
  variant,
  extraClasses = "",
  isError = false,
  isValid = false,
  ...rest
}): ReactElement => {
  const getVariantClasses: string = useMemo(() => {
    switch (variant) {
      case "underline":
        return "bg-transparent border-b border-b-input-border outline-none px-2.5 pb-1.5";
      case "outline":
        return "bg-white border border-neutral-200 outline-none px-3 py-1.5 leading-5";
      default:
        return "";
    }
  }, [variant]);

  return (
    <input
      {...rest}
      className={`w-full text-secondary text-xs font-montserrat font-normal 
        ${getVariantClasses}
        ${extraClasses}
        ${variant === "underline" && isError ? "!border-red-500" : ""}
        ${variant === "outline" && isError ? "!bg-red-100 !text-red-700" : ""}
        ${variant === "outline" && isValid ? "!bg-green-100" : ""}
      `}
    />
  );
};

export default TextInput;
