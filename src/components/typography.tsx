import { FC } from "react";

const Typography: FC<Typography & ExtendStyles> = ({
  text,
  variant,
  extraClasses = "",
  ...rest
}) => {
  return variant === "main-heading" ? (
    <h1
      {...rest}
      className={`text-black max-sm:text-3xl max-md:text-4xl text-5xl font-extrabold relative ${extraClasses}`}
    >
      {text}
    </h1>
  ) : variant === "heading" ? (
    <h2
      {...rest}
      className={`text-light-black max-sm:text-xl max-md:text-2xl text-3xl font-normal ${extraClasses}`}
    >
      {text}
    </h2>
  ) : variant === "sub-heading" ? (
    <h3 {...rest} className={`text-light-black font-medium ${extraClasses}`}>
      {text}
    </h3>
  ) : variant === "text" ? (
    <p
      {...rest}
      className={`text-black max-md:text-base text-sm font-semibold relative ${extraClasses}`}
    >
      {text}
    </p>
  ) : variant === "text-normal" ? (
    <p
      {...rest}
      className={`text-black max-md:text-base text-sm relative leading-6 pb-5 ${extraClasses}`}
    >
      {text}
    </p>
  ) : variant === "unordered-list" ? (
    <ul {...rest} className={`text-black list-disc ${extraClasses}`}></ul>
  ) : variant === "list-item" ? (
    <li {...rest} className={`text-black pb-5 ${extraClasses}`}>
      {text}
    </li>
  ) : variant === "text-small" ? (
    <p
      {...rest}
      className={`text-secondary text-xs font-normal ${extraClasses}`}
    >
      {text}
    </p>
  ) : (
    <p className={extraClasses}>{text}</p>
  );
};

export default Typography;
