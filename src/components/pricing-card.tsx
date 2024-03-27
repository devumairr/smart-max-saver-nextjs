"use client";

import { FC, ReactElement } from "react";
import Image from "next/image";

import { PiCaretDoubleRightFill } from "react-icons/pi";
import { FaShippingFast } from "react-icons/fa";

import { Button, Typography } from ".";

import CreditCards from "../../public/assets/images/creadit-cards.png";

const PricingCard: FC<any> = ({
  product,
  isActive,
  onSelect,
  type,
  isCouponActivated
}): ReactElement => {
  const { description, oldPrice, newPrice, discount, imageUrl } = product;

  const name =
    (type === "es9pwtyk" && "Esaver Watt") ||
    (type === "sw9pwtyk" && "STOPWATT") ||
    "";

  const couponActivatedNewPrice = (newPrice - newPrice * 0.15).toFixed(2);

  return (
    <div
      className={`border-[6px] bg-white ${
        isActive ? "border-green-600" : "border-slate-100"
      } pt-4 sm:pt-6 lg:pt-16 px-2.5 pb-4 sm:pb-6 lg:pb-8 rounded-3xl`}
      onClick={() => onSelect(product)}
    >
      <Typography
        variant="heading"
        text={`${name}`}
        extraClasses="!text-gray-700 !text-base	 sm:!text-xl !font-bold !text-center uppercase mb-3"
      />
      <Typography
        variant="text"
        text={description}
        extraClasses="!text-gray-700 !text-base !font-semibold !text-center bg-zinc-100 rounded-xl"
      />
      <Image
        src={imageUrl}
        alt="product"
        className=" !w-6/12 mx-auto sm:w-full h-[200px] object-contain"
      />
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <Typography
          variant="heading"
          text={`$${oldPrice}`}
          extraClasses="!text-neutral-600 !text-lg sm:!text-2xl !font-bold !text-center line-through"
        />
        <Typography
          text={`$${isCouponActivated ? couponActivatedNewPrice : newPrice}`}
          variant="text"
          extraClasses="!text-green-600 !text-lg sm:  !text-2xl !font-bold !text-center"
        />
      </div>
      <Typography
        text={`You Save $${newPrice} (${discount}% Off ${
          isCouponActivated ? " + 15% OFF" : ""
        })`}
        variant="text"
        extraClasses="!text-gray-700 !text-sm !font-semibold !text-center mb-3"
      />
      <Button
        variant="gradient"
        extraClasses="uppercase !font-bold !rounded-full w-full !justify-center !py-2 sm:!py-3 lg:!py-5 mb-5"
        text="Select"
        endIcon={<PiCaretDoubleRightFill size={22} />}
        name="select-offer"
      />
      <Image
        src={CreditCards}
        alt="cards"
        className="w-full object-contain mb-5"
      />
      <div className="flex items-center justify-center gap-3">
        <Typography
          variant="text"
          text="FAST USA SHIPPING"
          extraClasses="!text-gray-700 !text-sm !font-bold"
        />
        <FaShippingFast size={28} />
      </div>
    </div>
  );
};

export default PricingCard;
