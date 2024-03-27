"use client";

import { FC, ReactElement, useEffect, useState } from "react";
import Image from "next/image";

import { Typography } from ".";

import test from "../../public/assets/images/stopwatt-product.png";

let timeout: NodeJS.Timeout;
let interval: NodeJS.Timeout;

const NotifyPopup: FC<ExtendStyles & { productName: string }> = (
  props
): ReactElement => {
  const [shouldNotify, setShouldNotify] = useState<boolean>(false);

  useEffect(() => {
    // show popup after every 3 seconds
    interval = setInterval(() => {
      setShouldNotify(true);
    }, 3000);

    // clear the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // check if timeout exists then clear the timeout
    if (timeout) {
      clearTimeout(timeout);
    }

    // immediately exit the function if `shouldNotify` is already false
    if (!shouldNotify) return;

    // hide popup after every 3 seconds once the popup is visible
    timeout = setTimeout(() => {
      setShouldNotify(false);
    }, 3000);

    // clear the timeout when component unmounts
    return () => clearTimeout(timeout);
  }, [shouldNotify]);

  return (
    <div
      className={`min-w-[380px] bg-white fixed bottom-2.5 left-2.5 flex ease-in-out duration-700 rounded-md shadow-notify-popup bg-green-100 transition-all z-20
        ${shouldNotify ? "translate-x-0" : "-translate-x-[110%]"}
    `}
    >
      <div className="w-[100px] flex items-center bg-white p-2.5">
        <Image
          src={test}
          alt="product image"
          className="w-full object-contain align-middle"
        />
      </div>
      <div className="w-[280px] px-5 py-2.5">
        <Typography
          variant="text"
          text="Avis J."
          extraClasses="!text-black !font-normal"
        />
        <Typography
          variant="text"
          text="from Dallas, US"
          extraClasses="!text-black !font-normal"
        />
        <div className="flex items-center gap-1 my-3">
          <Typography
            variant="text"
            text="just purchased:"
            extraClasses="!text-xs !text-black !font-normal"
          />
          <Typography
            variant="text"
            text={props.productName}
            extraClasses="!text-lime-500"
          />
        </div>
        <Typography
          variant="text"
          text="JUST NOW"
          extraClasses="!text-black !text-xs !font-normal text-right !leading-8"
        />
      </div>
    </div>
  );
};

export default NotifyPopup;
