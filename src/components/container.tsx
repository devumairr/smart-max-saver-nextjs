import { FC, PropsWithChildren, ReactElement } from "react";

const Container: FC<PropsWithChildren<ExtendStyles>> = ({
  children,
  extraClasses = ""
}): ReactElement => {
  return (
    <div
      className={`w-full max-w-screen-xl mx-auto p-1.5 px-3 ${extraClasses}`}
    >
      {children}
    </div>
  );
};

export default Container;
