"use client";

import { FC, ReactElement, useEffect, useState } from "react";
import Image from "next/image";

interface ExtendStyles {
  onActivateCoupon: () => void; // Define a new prop for the function
  isCouponActivated: boolean;
}

const OfferCoupon: FC<ExtendStyles> = (props): ReactElement => {
  const [shouldNotify, setShouldNotify] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShouldNotify(true);
    }, 6000);
  }, []);

  return (
    <div
      className={`py-2 w-full bg-yellow-300 fixed top-0 flex ease-in-out duration-700 shadow-notify-popup border-red-600 border-4 transition-all z-20
        ${shouldNotify ? "translate-x-0" : "-translate-x-[110%]"} ${
          props.isCouponActivated ? "d-none" : "d-flex"
        }
    `}
    >
      <div
        onClick={() => {
          setShouldNotify(false);
        }}
        className="absolute top-1 right-1 cursor-pointer"
      >
        <Image
          width={32}
          height={32}
          alt="coupon-cross-btn"
          src={
            "https://dev.smartesaver.com/sw9pwtyk/images/checkout-now-v1/xclose.png"
          }
        />
      </div>
      <div className="w-full text-center flex flex-col items-center justify-center">
        <p className="text-[#00e] font-extrabold !text-sm sm:text-xl">
          Save an EXTRA 15% OFF with this FREE COUPON!
        </p>

        <p className="mt-4 sm:max-w-xl !max-w-md !text-sm	">
          This is a special promotion that only 5 lucky visitors get per week.
          You must use this coupon or it will be given away to another customer.
        </p>

        <button
          className="mt-4 bg-[#0bba18] border-[#04730c] hover:bg-[#04730c] border-2 rounded-md flex justify-center font-extrabold sm:text-xl items-center sm:px-20 py-4 !px-8 text-white mb-4 !text-base"
          onClick={() => {
            props.onActivateCoupon();
            setShouldNotify(false);
          }}
          name="apply-coupon"
        >
          Activate My Coupon!
        </button>
      </div>
    </div>
  );
};

export default OfferCoupon;
