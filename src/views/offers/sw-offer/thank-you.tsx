"use client";

import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  Container,
  Typography,
  SwFooter,
  FullScreenLoader
} from "@/components";

import { importClick, orderQuery } from "@/services";
import { formatDate } from "@/helpers";

import ticimg from "../../../../public/assets/images/tick_icon.png";
import cardimg from "../../../../public/assets/images/fed-ex.png";
import userimg from "../../../../public/assets/images/cs-img.png";
import { ES_OFFER, SW_OFFER } from "@/constants/offers";
import stopwatt_logo from "../../../../public/assets/images/stopwatt.png";
import esaverwatt_logo from "../../../../public/assets/images/esaver-watt.png";
import EsFooter from "@/components/es-footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace("https://", "");

const SwThankYou: FC<any> = ({ type }): ReactElement => {
  const searchParams = useSearchParams();

  const logo =
    (type === ES_OFFER && esaverwatt_logo) ||
    (type === SW_OFFER && stopwatt_logo) ||
    "";
  const orderId = searchParams.get("orderId");

  const [myOrder, setMyOrder] = useState<any>({});

  const handleSession = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      call_type: "landers_clicks_import",
      pageType: "presellPage",
      sessionId
    };

    await importClick(data);
  }, []);

  const getOrders = useCallback(async () => {
    const data: any = {
      call_type: "order_query",
      orderId
    };

    const { message, result } = await orderQuery(data);

    if (result === "SUCCESS") {
      const {
        data: { 0: order }
      } = message;

      setMyOrder(order);
    }
  }, [orderId]);

  useEffect(() => {
    handleSession();
  }, [handleSession]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  if (Object.keys(myOrder).length === 0) {
    return <FullScreenLoader />;
  }

  const {
    city,
    currencySymbol,
    dateCreated,
    emailAddress,
    name,
    phoneNumber,
    postalCode,
    shipAddress1,
    shipCountry,
    shipState,
    totalAmount,
    items
  } = myOrder;

  const stopWattsIds = [153, 154, 155, 156, 157, 158, 159, 160];

  const stopWatts = Object.keys(items)
    .map((key) => {
      return items[key];
    })
    .filter((item) => {
      return stopWattsIds.includes(Number(item.productId));
    });

  const otherProducts = Object.keys(items)
    .map((key) => {
      return items[key];
    })
    .filter((item) => {
      return !stopWattsIds.includes(Number(item.productId));
    });

  const stopwattsCount = stopWatts.reduce((prevCount, { qty }) => {
    return prevCount + Number(qty);
  }, 0);

  // eslint-disable-next-line no-console
  console.log(stopWatts, otherProducts);

  return (
    <>
      <div className="flex border-b-[2px] py-[2.5px] bg-white">
        <div className="m-auto">
          <Image className="w-[185px]" src={logo} alt="logo" />
        </div>
      </div>
      <div className="bg-neutral-200">
        <div className="w-full bg-sky-700">
          <Container extraClasses="py-0">
            <div className="grid grid-cols-12">
              <div className="col-span-3" />
              <div className="col-span-6 bg-gradient-to-b from-white/0 to-white/20  p-7">
                <div className="flex justify-center items-center gap-3">
                  <Image
                    className="w-7 object-contain"
                    src={ticimg}
                    alt="tic image"
                  />
                  <Typography
                    text="Thank you! Your order has been placed."
                    variant="heading"
                    extraClasses="flex-1 !text-white !font-bold !font-sans-serif !text-[22px]"
                  />
                </div>
                <Typography
                  text={`We will pack your order and ship it to you right away. You will receive an email confirmation shortly at ${emailAddress}. Please print this page for your records.`}
                  variant="text"
                  extraClasses="!text-white !font-sans !font-normal !text-[15px] !leading-5 mt-2.5 !font-sans-serif"
                />
              </div>
              <div className="col-span-3" />
            </div>
          </Container>
        </div>
        <Container extraClasses="!py-0">
          <div className="grid grid-cols-12">
            <div className="col-span-3" />
            <div className="col-span-6 bg-[#fff] m-auto rounded-b-xl">
              <div className="w-full">
                <div className="px-7 py-10 z-0">
                  <div className="flex items-start gap-7 bg-[#fffcf4] border-[#fec41e] border-2 p-6 rounded-md mb-8">
                    <Image
                      className="w-20 object-contain"
                      src={cardimg}
                      alt="card image"
                    />
                    <Typography
                      text="This is an American-owned business that doesn't believe it should take 45 days to receive your product from China. Orders are sent from our Florida warehouse via USPS, FedEx, UPS, or DHL for international customers depending on speed and efficiency of delivery. Product will be shipped within 48 business hours. Please allow between 5-7 days for standard delivery. You will be emailed a tracking link after your order is shipped. Thank you for your purchase!"
                      variant="text"
                      extraClasses="flex-1 !text-stone-500 !font-sans !font-normal !text-base !leading-6"
                    />
                  </div>
                  <div>
                    <Typography
                      text="ORDER DETAILS"
                      variant="text"
                      extraClasses="!text-[#999999] !font-light !text-[18px] !leading-[50px]"
                    />
                    <div className="flex justify-between">
                      <Typography
                        text="Order Date"
                        variant="text"
                        extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start !leading-[50px]"
                      />
                      <Typography
                        text={formatDate(new Date(dateCreated))}
                        variant="text"
                        extraClasses="!text-[#333333] !font-bold !text-[18px] !flex !justify-start"
                      />
                    </div>
                    <div className="flex justify-between">
                      <Typography
                        text="Order Total"
                        variant="text"
                        extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start !leading-[50px]"
                      />
                      <Typography
                        text={`${currencySymbol}${totalAmount}`}
                        variant="text"
                        extraClasses="!text-[#333333] !font-bold !text-[18px] !flex !justify-start"
                      />
                    </div>
                    <div className="flex justify-between pb-4">
                      <Typography
                        text="Order Number"
                        variant="text"
                        extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start !leading-[50px]"
                      />
                      <Typography
                        text={orderId || ""}
                        variant="text"
                        extraClasses="!text-[#333333] !font-bold !text-[18px] !flex !justify-start"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <div className="bg-[#f2f2f2] w-1/2 px-5 pb-4 rounded-md">
                      <Typography
                        text="SHIPPING ADDRESS"
                        variant="text"
                        extraClasses="!text-[#999999] !font-medium !text-[14px] !leading-[50px]"
                      />
                      <Typography
                        text={`Name: ${name}`}
                        variant="text"
                        extraClasses="!text-[#666666] !font-medium !text-[14px] !leading-7"
                      />
                      <Typography
                        text={`Phone Number: ${phoneNumber}`}
                        variant="text"
                        extraClasses="!text-[#666666] !font-medium !text-[14px] !leading-7"
                      />
                      <Typography
                        text={`Shipping Address: ${shipAddress1}, ${city}, ${shipState}, ${postalCode}, ${shipCountry}`}
                        variant="text"
                        extraClasses="!text-[#666666] !font-medium !text-[14px] !leading-7 capitalize"
                      />
                    </div>
                    <div className="bg-[#f2f2f2] w-1/2 px-5 pb-4 rounded-md">
                      <Typography
                        text="BILLING ADDRESS"
                        variant="text"
                        extraClasses="!text-[#999999] !font-medium !text-[14px] !leading-[50px]"
                      />
                      <Typography
                        text={`Name: ${name}`}
                        variant="text"
                        extraClasses="!text-[#666666] !font-medium !text-[14px] !leading-7"
                      />
                      <Typography
                        text={`Phone Number: ${phoneNumber}`}
                        variant="text"
                        extraClasses="!text-[#666666] !font-medium !text-[14px] !leading-7"
                      />
                      <Typography
                        text={`Billing Address: ${shipAddress1}, ${city}, ${shipState}, ${postalCode}, ${shipCountry}`}
                        variant="text"
                        extraClasses="!text-[#666666] !font-medium !text-[14px] !leading-7 capitalize"
                      />
                    </div>
                  </div>
                  <div>
                    <Typography
                      text="ORDER SUMMARY"
                      variant="text"
                      extraClasses="!text-[#999999] !font-light !text-[18px] !leading-[50px] !pt-5"
                    />
                    {stopWatts.map((stopWatt) => {
                      return (
                        <div key={stopWatt.name}>
                          <div className="flex justify-between">
                            <Typography
                              text={stopWatt.name}
                              variant="text"
                              extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start !leading-[30px]"
                            />
                            <Typography
                              text="$59.65"
                              variant="text"
                              extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start"
                            />
                          </div>
                          <div className="flex justify-between">
                            <Typography
                              text="Shipping"
                              variant="text"
                              extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start !leading-[30px]"
                            />
                            <Typography
                              text="$9.95"
                              variant="text"
                              extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start"
                            />
                          </div>
                          <div className="flex justify-between pb-2">
                            <Typography
                              text="Total Paid Today"
                              variant="text"
                              extraClasses="!text-[#333333] !font-bold !text-[18px] !flex !justify-start !leading-[30px]"
                            />
                            <Typography
                              text="$69.60"
                              variant="text"
                              extraClasses="!text-[#333333] !font-bold !text-[18px] !flex !justify-start"
                            />
                          </div>
                          <Typography
                            text="(Billed Separately)"
                            variant="text"
                            extraClasses="!text-[#999999] !font-medium !text-[15px] "
                          />
                          <div className="border-t-[1px] border-[#e5e5e5] my-5 "></div>
                        </div>
                      );
                    })}
                    <div className="border-b-[1px] border-[#e5e5e5] pb-5">
                      <p className="text-neutral-800 text-base font-medium text-center">
                        You ordered{" "}
                        <span className="text-red-500 font-bold ">
                          {stopwattsCount} Units of StopWatt
                        </span>
                      </p>
                    </div>

                    {otherProducts.map((prod) => {
                      return (
                        <div key={prod.name}>
                          <div className="flex justify-between">
                            <Typography
                              text={prod.name}
                              variant="text"
                              extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start !leading-[30px]"
                            />
                            <Typography
                              text={`$${prod.price}`}
                              variant="text"
                              extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start"
                            />
                          </div>
                          <div className="flex justify-between">
                            <Typography
                              text="Shipping"
                              variant="text"
                              extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start !leading-[30px]"
                            />
                            <Typography
                              text={`$${prod.shipping}`}
                              variant="text"
                              extraClasses="!text-[#333333] !font-medium !text-[18px] !flex !justify-start"
                            />
                          </div>
                          <div className="flex justify-between pb-2">
                            <Typography
                              text="Total Paid Today"
                              variant="text"
                              extraClasses="!text-[#333333] !font-bold !text-[18px] !flex !justify-start !leading-[30px]"
                            />
                            <Typography
                              text="$69.60"
                              variant="text"
                              extraClasses="!text-[#333333] !font-bold !text-[18px] !flex !justify-start"
                            />
                          </div>
                          <Typography
                            text="(Billed Separately)"
                            variant="text"
                            extraClasses="!text-[#999999] !font-medium !text-[15px] "
                          />
                          <div className="border-t-[1px] border-[#e5e5e5] my-5 "></div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <Typography
                      text={`Charges on your statement will appear as ${siteUrl}`}
                      variant="text"
                      extraClasses="!font-serif !font-light !text-center !text-[18px] pt-6 pb-0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-3" />
          </div>
          <div className="flex flex-row w-[50%] m-auto bg-gradient-to-t from-[#c4c4c400] to-[#c4c4c4] p-9 rounded-t-md mt-8">
            <div className="w-[15%]">
              <Image className="w-32" src={userimg} alt="user image" />
            </div>
            <div className="w-[85%] pl-6">
              <Typography
                text="We are here to help you."
                variant="heading"
                extraClasses="!text-center !text-black !font-bold !font-serif !pb-5"
              />
              <Typography
                text="If you have any questions or comments about your order or our products, don't hesitate to reach out to our amazing Customer Service Team. You may also email us at "
                variant="text-small"
                extraClasses="!text-start !text-[#666666] !font-normal !font-sans !text-[17px] !leading-6"
              />
              <Link href="/" className="text-[#007bff] font-medium">
                {type === SW_OFFER
                  ? "support@garnetesmartmax.com"
                  : "support@smartesaver.com"}
              </Link>
              <Typography
                text="and one of our agents will get back to you within 24 hours. "
                variant="text-small"
                extraClasses="!text-start !text-[#666666] !font-normal !font-sans !text-[17px] !leading-6"
              />
            </div>
          </div>
        </Container>
      </div>
      {type === ES_OFFER ? <EsFooter /> : <SwFooter />}
    </>
  );
};

export default SwThankYou;
