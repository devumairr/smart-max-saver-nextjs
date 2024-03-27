import { FC, ReactElement, useMemo } from "react";

const Select: FC<ISelect & ExtendStyles> = ({
  variant,
  options,
  isValid = false,
  isError = false,
  extraClasses = "",
  ...rest
}): ReactElement => {
  const getVariantClasses: string = useMemo(() => {
    switch (variant) {
      case "underline":
        return "bg-transparent border-b border-b-input-border outline-none px-2.5 pb-1.5";
      case "outline":
        return "bg-white border border-secondary outline-none px-3 py-1.5 leading-5";
      default:
        return "";
    }
  }, [variant]);

  return (
    <select
      {...rest}
      className={`w-full text-secondary text-xs font-montserrat font-normal
        ${getVariantClasses}
        ${extraClasses} 
        ${variant === "outline" && isError ? "!bg-red-100 !text-red-700" : ""}
        ${variant === "outline" && isValid ? "!bg-green-100" : ""}`}
    >
      {options.map(({ label, id }, index) => {
        return (
          <option value={id} key={`${id}-${index + 1}`}>
            {label}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
