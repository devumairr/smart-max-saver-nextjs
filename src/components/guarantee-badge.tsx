import { FC, ReactElement } from "react";
import Image from "next/image";

import { Typography } from ".";

import Warranty from "../../public/assets/images/90-days.png";

const GuranteeBadge: FC<ExtendStyles> = ({
  extraClasses = ""
}): ReactElement => {
  return (
    <div
      className={`max-w-[400px] flex items-center gap-5 py-5 ${extraClasses}`}
    >
      <Image className="w-20" src={Warranty} alt="90 days warranty" />
      <Typography
        variant="text"
        text="60 DAYS MONEY BACK GUARANTEE CHOOSE YOURS AND START SAVING NOW"
        extraClasses="flex-1 !font-bold"
      />
    </div>
  );
};

export default GuranteeBadge;
