import { FC, ReactElement } from "react";
import Image from "next/image";

import { Typography } from ".";

import Loading from "../../public/assets/images/loading.gif";

const ProgressLoader: FC = (): ReactElement => {
  return (
    <div className="w-screen h-screen grid place-items-center fixed left-0 top-0 z-30">
      <div className="absolute w-screen h-screen bg-black opacity-50" />
      <div className="rounded-lg p-2.5 flex items-center gap-2.5 bg-zinc-700 border-2 border-white opacity-80 z-10">
        <Image src={Loading} alt="loader" />
        <Typography
          variant="text"
          text="Processing your request...Please wait."
          extraClasses="!text-white !text-xs"
        />
      </div>
    </div>
  );
};

export default ProgressLoader;
