"use client";
import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import Image from "next/image";

import {
  Container,
  Typography,
  ProgressLoader,
  FsaverReview,
  FsaverTakeTheDeal
} from "@/components";

import stopwatt_logo from "../../../../public/assets/images/stopwatt.png";
import esaverwatt_logo from "../../../../public/assets/images/esaver-watt.png";
import upsell2Img from "../../../../public/assets/images/upsell2Img.png";
import fuelpdt2 from "../../../../public/assets/images/fuel-saver-pdt2.jpg";
import fuelpdt3 from "../../../../public/assets/images/fuel-saver-pdt3.png";
import iconv1 from "../../../../public/assets/images/iconv1.jpg";
import iconv2 from "../../../../public/assets/images/iconv2.jpg";
import iconv3 from "../../../../public/assets/images/iconv3.jpg";
import iconv4 from "../../../../public/assets/images/iconv4.jpg";
import fuel_big from "../../../../public/assets/images/fuel_big.jpg";

import { fetchProducts, importClick, upsaleImport } from "@/services";
import { ES_OFFER_CAMPAIGN_ID, SW_OFFER_CAMPAIGN_ID } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from "@/hooks";
import { BsCheck } from "react-icons/bs";
import { ES_OFFER, SW_OFFER } from "@/constants/offers";

const SwFsaver: FC<any> = ({ type }): ReactElement => {
  const [remoteProduct, setRemoteProduct] = useState<any>({});
  const [quantity, setQuantity] = useState<number>(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showAlert } = useAlert();
  const OFFER_CAMPAIGN_ID =
    (type === ES_OFFER && ES_OFFER_CAMPAIGN_ID) ||
    (type === SW_OFFER && SW_OFFER_CAMPAIGN_ID) ||
    "";
  const logo =
    (type === ES_OFFER && esaverwatt_logo) ||
    (type === SW_OFFER && stopwatt_logo) ||
    "";
  const orderId = searchParams.get("orderId");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSession = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      call_type: "landers_clicks_import",
      pageType: "upsellPage4",
      sessionId
    };

    await importClick(data);
  }, []);

  const handleProducts = useCallback(async () => {
    const { result, message } = await fetchProducts({
      campaignId: OFFER_CAMPAIGN_ID
    });

    if (result === "SUCCESS") {
      const {
        data: {
          [OFFER_CAMPAIGN_ID]: { products }
        }
      } = message;

      const upsellProduct = products.filter((product: any) => {
        return product.productId === 16 && product.productType === "UPSALE";
      });

      setRemoteProduct(upsellProduct[quantity - 1]);
    }
  }, [quantity, OFFER_CAMPAIGN_ID]);

  const addToMyOrder = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      call_type: "upsale_import",
      productId: remoteProduct.campaignProductId,
      productQty: remoteProduct.maxOrderQty,
      orderId,
      sessionId
    };

    setIsProcessing(true);

    const { result, message } = await upsaleImport(data);

    if (result === "SUCCESS") {
      setIsProcessing(false);
      router.push(`/offers/${type}/laundry?${searchParams}`);
    }

    if (result === "ERROR") {
      setIsProcessing(false);
      showAlert({
        type: "error",
        title: message,
        onOk: (MySwal) => {
          MySwal.clickConfirm();
          router.push(`/offers/${type}/fsaver?${searchParams}`);
        }
      });
    }
  }, [orderId, remoteProduct, router, searchParams, showAlert, type]);

  useEffect(() => {
    handleProducts();
  }, [handleProducts]);

  useEffect(() => {
    handleSession();
  }, [handleSession]);

  return (
    <>
      {isProcessing && <ProgressLoader />}
      <div className="bg-[#f6f6f6] font-roboto max-sm:w-[500px]">
        <div className="flex border-b-[2px] py-[2.5px] bg-white">
          <div className="m-auto">
            <Image className="w-[185px]" src={logo} alt="logo" />
          </div>
        </div>
        <Container extraClasses="!max-w-[993px] pb-4">
          <div className="flex border-2 border-green rounded w-[30rem] mx-auto my-2 mt-2">
            <div className="bg-green flex justify-center items-center w-9">
              <BsCheck className="text-3xl font-light text-white" />
            </div>
            <div className="font-semibold text-lg mb-[3px] px-2 py-1 tracking-wide ">
              Congratulations! Your order has been processed.
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-4 mt-[1.7rem] shadow-xl shadow-[#9b9b9b]">
            <div className="flex justify-center mt-[-35px]">
              <div className="px-[28px] py-[7px] text-[16px] tracking-wider bg-green text-white rounded-3xl font-bold w-fit capitalize">
                BONUS DEAL
              </div>
            </div>
            <section className="mx-auto w-[90%] md:w-[83.5%]">
              <Typography
                text="GRAB YOUR BONUS"
                variant="heading"
                extraClasses="text-[24px] !font-bold !text-center !tracking-wider !pt-1"
              />
              <div className="text-center text-[14px] md:!px-14 tracking-wider">
                <strong>SPECIAL OFFER</strong>: Fuel Saver Plugs are available
                at the price of{" "}
                <span className="text-[#FF0000] font-bold line-through italic">
                  ${(78.99 * quantity).toFixed(2)}
                </span>{" "}
                <span className="text-[#28a745] font-semibold">
                  ${remoteProduct?.price}
                </span>
                /ea <span className="italic font-semibold">(75% Discount)</span>{" "}
                <span className="text-[#008000] font-semibold">
                  Free Delivery
                </span>{" "}
                on every order today! Only{" "}
                <span className="text-[#FF0000] font-bold">6 left</span> in
                stock, <span className="font-semibold">Order soon!</span>
              </div>

              <div className="flex max-lg:flex-row max-sm:flex-col max-md:flex-row gap-8 mt-2">
                <div className="lg:w-[38%] max-sm:m-auto md:w-[38%]">
                  <Image
                    src={fuelpdt2}
                    alt="fuel-pd2"
                    height={300}
                    width={420}
                  />
                  <FsaverTakeTheDeal
                    onClick={addToMyOrder}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    searchParams={searchParams}
                    product={remoteProduct}
                  />
                  <div className="max-sm:m-auto max-sm:w-[17rem]">
                    <Image
                      src={fuelpdt3}
                      alt="fuel-pd2"
                      height={290}
                      width={290}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="px-3 py-5 max-sm:w-[460px] max-sm:-ml-[30px] shadow-md shadow-[#e3e3e3] rounded-lg">
                    <Typography
                      variant="text"
                      text="REDUCE YOUR FUEL CONSUMPTION BY UP TO 35%"
                      extraClasses="!text-[17px] !font-bold"
                    />
                    <Typography
                      variant="text"
                      text="Upgrade your car with this intelligent fuel saving device that easily installs and begins tuning your vehicle’s ECU for lower fuel consumption. Buy now and save 75%!"
                      extraClasses="italic !max-sm:text-[18px] !font-medium !text-sm mt-2 mb-8"
                    />
                    <Typography
                      variant="text"
                      text="BENEFITS:"
                      extraClasses="!text-[19px] mb-3 !font-extrabold !pb-4"
                    />
                    <ul className="font-medium">
                      <li className="text-xs pb-1 relative ml-[33px] max-sm:text-[18px] max-sm:leading-6 text-[17px] leading-[18px]">
                        <div className="absolute top-[2px] left-[-20px]">
                          <div className="w-[5px] h-[5px] bg-black rounded-[5px]"></div>
                        </div>
                        <span className="text-[#34a486] font-semibold ">
                          SAVE MONEY WHILE YOU FILL UP:{" "}
                        </span>
                        Built to save you fuel without making expensive
                        modifications to your car, the Fuel Saver is here to
                        save you money at the gas pump.
                      </li>
                      <li className="text-xs pb-1 relative ml-[33px] max-sm:text-[18px] max-sm:leading-6 text-[17px] leading-[18px]">
                        <div className="absolute top-[2px] left-[-20px]">
                          <div className="w-[5px] h-[5px] bg-black rounded-[5px]"></div>
                        </div>
                        <span className="text-[#34a486] font-semibold">
                          ENHANCE YOUR ECU SYSTEM:{" "}
                        </span>
                        Nearly every vehicle is built with an electronic control
                        unit (ECU) system which is a programmable chip that,
                        when used with the Fuel Saver, it will reprogram your
                        vehicle’s system to enhance its fuel efficiency by
                        15-25%, add 35% more power and 25% more torque!
                      </li>
                      <li className="text-xs pb-1 relative ml-[33px] max-sm:text-[18px] max-sm:leading-6 text-[17px] leading-[18px]">
                        <div className="absolute top-[2px] left-[-20px]">
                          <div className="w-[5px] h-[5px] bg-black rounded-[5px]"></div>
                        </div>
                        <span className="text-[#34a486] font-semibold">
                          SMALL AND LIGHTWEIGHT:{" "}
                        </span>
                        If you’re concerned about attaching something big and
                        bulky, causing an eye-sore to the inside of your
                        vehicle, you don’t have to worry about that with the
                        Fuel Saver! This device is small and lightweight, making
                        it super easy to install and even easier to conceal.
                      </li>
                      <li className="text-xs pb-1 relative ml-[33px] max-sm:text-[18px] max-sm:leading-6 text-[17px] leading-[18px]">
                        <div className="absolute top-[2px] left-[-20px]">
                          <div className="w-[5px] h-[5px] bg-black rounded-[5px]"></div>
                        </div>
                        <span className="text-[#34a486] font-semibold">
                          HELP FIGHT AGAINST CLIMATE CHANGE:{" "}
                        </span>
                        By lowering your fuel consumption each time you fill at
                        the gas station using the Fuel Saver, you are actively
                        doing your part to decrease the harmful carbon pollution
                        caused by transportation!
                      </li>
                      <li className="text-xs pb-1 relative ml-[33px] max-sm:text-[18px] max-sm:leading-6 text-[17px] leading-[18px]">
                        <div className="absolute top-[2px] left-[-20px]">
                          <div className="w-[5px] h-[5px] bg-black rounded-[5px]"></div>
                        </div>
                        <span className="text-[#34a486] font-semibold">
                          EASY TO USE:{" "}
                        </span>
                        This device is easy to install. Just follow the quick
                        and easy 6-step list of instructions and go! Locating
                        the OBD2 port in your vehicle can easily be found
                        through either your vehicle’s user manual or on the
                        instructional panel within the Fuel Saver packaging.
                      </li>
                      <li className="text-xs pb-1 relative ml-[33px] max-sm:text-[18px] max-sm:leading-6 text-[17px] leading-[18px]">
                        <div className="absolute top-[2px] left-[-20px]">
                          <div className="w-[5px] h-[5px] bg-black rounded-[5px]"></div>
                        </div>
                        <span className="text-[#34a486] font-semibold">
                          STRONG COMPATIBILITY:{" "}
                        </span>
                        The Fuel Saver fits nearly all vehicle make and models
                        from the year of 1996 or newer.
                      </li>
                    </ul>

                    <Typography
                      variant="text"
                      text="➤ Specification:"
                      extraClasses="!text-[16px] mt-4"
                    />

                    <p className="text-sm max-sm:text-[16px]">
                      Color: Green &amp; White
                      <br />
                      Dimensions: ‎2.50 x 2.00 x 0.80 inches
                      <br />
                      Item Weight: 1.76 ounces
                    </p>

                    <div className="flex justify-between mt-6">
                      <div>
                        <Typography
                          variant="text"
                          text="➤ Package Includes:"
                          extraClasses="!text-[16px]"
                        />

                        <p className="text-sm max-sm:text-[16px]">
                          1 Fuel Saver Plug
                          <br />1 User Guide
                        </p>
                      </div>
                      <Image
                        src={upsell2Img}
                        alt="fuel-pd2"
                        height={130}
                        width={130}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex max-lg:flex-row max-sm:flex-col pt-[30px] pb-[50px]">
                <div className="flex-1 flex flex-col justify-center items-center gap-2 py-5 px-[35px] lg:border-r max-sm:border-b max-sm:border-r-none border-light-grey border-solid">
                  <Image src={iconv1} alt="icon" width={30} height={30} />
                  <Typography
                    variant="text-small"
                    text="Safe & Easy to Use"
                    extraClasses="!text-sm text-center"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center items-center gap-2 py-5 px-[35px] lg:border-r max-sm:border-b max-sm:border-r-none border-light-grey border-solid">
                  <Image src={iconv2} alt="icon" width={30} height={30} />
                  <Typography
                    variant="text-small"
                    text="Save Money at the Gas Pump"
                    extraClasses="!text-sm text-center"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center items-center gap-2 py-5 px-[35px] lg:border-r max-sm:border-b max-sm:border-r-none border-light-grey border-solid">
                  <Image src={iconv3} alt="icon" width={30} height={30} />
                  <Typography
                    variant="text-small"
                    text="Help Fight Against Climate Change"
                    extraClasses="!text-sm text-center"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center items-center gap-2 py-5 px-[35px] ">
                  <Image src={iconv4} alt="icon" width={30} height={30} />
                  <Typography
                    variant="text-small"
                    text="Increase your Vehicle’s Horsepower & Torque"
                    extraClasses="!text-sm text-center"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <div className="min-w-[440px]">
                  <FsaverTakeTheDeal
                    link
                    onClick={addToMyOrder}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    searchParams={searchParams}
                    product={remoteProduct}
                  />
                </div>
              </div>
              <Image
                src={fuel_big}
                alt="fuel_big"
                width={712}
                height={357}
                className="mx-auto"
              />

              <div>
                <Typography
                  variant="heading"
                  text="Fuel Save Pro Customers"
                  extraClasses="!pb-10 !pl-5 !font-bold"
                />
                <FsaverReview />
              </div>

              <div className="flex justify-center">
                <div className="min-w-[440px]">
                  <FsaverTakeTheDeal
                    link
                    onClick={addToMyOrder}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    searchParams={searchParams}
                    product={remoteProduct}
                    type={type}
                  />
                </div>
              </div>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
};
export default SwFsaver;
