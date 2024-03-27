import { FC, ReactElement } from "react";

const FullScreenLoader: FC = (): ReactElement => {
  return (
    <div className="fixed w-full inset-0 h-screen bg-white grid place-items-center z-[9999]">
      <div className="w-10 aspect-square rounded-full bg-primary animate-pulse-loader"></div>
    </div>
  );
};

export default FullScreenLoader;
