import { FC, ReactElement } from "react";
import Image from "next/image";

import { Typography } from ".";

const TextBox: FC<ITextBox> = ({
  text,
  imageSource,
  isActive = false,
  isInvert = false
}): ReactElement => {
  return (
    <div
      className={`flex items-center gap-3 max-w-[230px] ${
        isInvert ? "sm:flex-row-reverse" : ""
      }`}
    >
      <Image
        className="sm:w-20 w-16 h-20 object-contain"
        src={imageSource}
        alt="image"
      />
      <Typography
        variant="text"
        text={text}
        extraClasses={`flex-1 !font-light leading-4  !text-xs sm:text-base ${
          isActive ? "!text-lime-500" : "!text-gray-700"
        } ${isInvert ? "text-right" : ""}`}
      />
    </div>
  );
};

export default TextBox;
