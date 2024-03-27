import { FC, ReactElement } from "react";

const VidepPlayer: FC<IVideo> = ({ source, ...rest }): ReactElement => {
  return (
    <video {...rest}>
      <source src={source} type="video/mp4" />
    </video>
  );
};

export default VidepPlayer;
