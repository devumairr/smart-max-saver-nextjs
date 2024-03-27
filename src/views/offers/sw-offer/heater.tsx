"use client";
import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { Container, Typography, Button, ProgressLoader } from "@/components";
import Link from "next/link";

import StopWatt from "../../../../public/assets/images/stopwatt.png";
import EsaverWatt from "../../../../public/assets/images/esaver-watt.png";
import fstars from "../../../../public/assets/images/5-stars.png";
import simg1 from "../../../../public/assets/images/heater-1.jpg";
import simg2 from "../../../../public/assets/images/heater-2.jpg";
import simg3 from "../../../../public/assets/images/heater-3.jpg";
import simg4 from "../../../../public/assets/images/heater-4.jpg";
import gimg from "../../../../public/assets/images/guarantee.png";
import image5 from "../../../../public/assets/images/usps.png";
import arrimg from "../../../../public/assets/images/play.png";
import { fetchProducts, importClick, upsaleImport } from "@/services";
import { ES_OFFER_CAMPAIGN_ID, SW_OFFER_CAMPAIGN_ID } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from "@/hooks";
import { ES_OFFER, SW_OFFER } from "@/constants/offers";

const SwHeater: FC<any> = ({ type }): ReactElement => {
  const [remoteProduct, setRemoteProduct] = useState<any>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [maxCount, setMaxCount] = useState<number>(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showAlert } = useAlert();
  const OFFER_CAMPAIGN_ID =
    (type === ES_OFFER && ES_OFFER_CAMPAIGN_ID) ||
    (type === SW_OFFER && SW_OFFER_CAMPAIGN_ID) ||
    "";

  const productType = {
    productLogo:
      (type === ES_OFFER && EsaverWatt) || (type === SW_OFFER && StopWatt) || ""
  };

  const orderId = searchParams.get("orderId");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const finalPrice = Number(remoteProduct?.price) || 0;
  const discountPercentage = 70;
  const originalPrice = finalPrice / (1 - discountPercentage / 100);
  const retailPrice = (originalPrice * quantity).toFixed(2);
  const productPrice = Number(remoteProduct?.price * quantity).toFixed(2) || 0;

  const [activeImg, setActiveImg] = useState(0);
  const images = [simg1, simg2, simg3, simg4];

  const handleSession = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      call_type: "landers_clicks_import",
      pageType: "upsellPage3",
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
        return product.productId === 20 && product.productType === "UPSALE";
      });
      setMaxCount(upsellProduct.length);

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
      router.push(`/offers/${type}/fsaver?${searchParams}`);
    }

    if (result === "ERROR") {
      setIsProcessing(false);
      showAlert({
        type: "error",
        title: message,
        onOk: (MySwal) => {
          MySwal.clickConfirm();
          router.push(`/offers/${type}/heater?${searchParams}`);
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
      <Container extraClasses="!max-w-full !pb-10 !m-0 !p-0">
        <div className="SwHeater max-sm:w-[700px] max-md:w-[800px]">
          <div className="py-[10px] bg-[#eb3f36] flex justify-center">
            <Typography
              text="Special Offer Unlocked - "
              variant="text"
              extraClasses="!text-white !font-medium lg:text-[16px] !font-inter max-sm:text-[18px]"
            />
            <Typography
              text="Do Not Close This Page"
              variant="text"
              extraClasses="!text-white !font-bold lg:text-[16px] !pl-2 !font-inter max-sm:text-[18px]"
            />
          </div>
          <div className="lg:flex md:flex w-2/3 m-auto py-1">
            <div className="w-1/2 max-sm:w-full max-md:w-full max-sm:flex max-sm:justify-center max-md:flex max-md:justify-center">
              <Image
                className="w-32 pt-[3px] max-sm:w-[12rem] max-sm:py-2 max-md:w-[13rem]"
                src={productType.productLogo}
                alt="logo"
              />
            </div>
            <div className="max-sm:w-full max-sm:justify-center max-md:justify-center pt-[10px] flex lg:pl-[19%]">
              <Typography
                text="CHECKOUT"
                variant="text"
                extraClasses="!text-[#bbb] !font-normal !text-[16px] max-sm:!text-[21px] !pl-2 !font-inter "
              />
              <span className="text-[#bbb] !font-medium px-6 text-[20px] relative bottom-1">
                /
              </span>
              <Typography
                text="UPGRADES"
                variant="text"
                extraClasses="!text-[#292aac] !font-normal !text-[16px] max-sm:!text-[21px] !pl-2 !font-inter "
              />
              <span className="text-[#bbb] !font-medium px-6 text-[20px] relative bottom-1">
                /
              </span>
              <Typography
                text="SUMMARY"
                variant="text"
                extraClasses="!text-[#bbb] !font-normal !text-[16px] max-sm:!text-[21px] !pl-2 !font-inter "
              />
            </div>
          </div>
          <div className="text-center bg-[#ffcc56] pb-20 relative z-0">
            <Typography
              text="Wait! Your Order Isn't Complete"
              variant="main-heading"
              extraClasses="!text-[#0655b7] !font-extrabold !pt-6 !pb-3 lg:!text-[2.7rem] !font-inter max-sm:!text-[2.5rem]"
            />
            <Typography
              text={`Special Discount: Save more electricity with Ultra Air Heater For Only $${productPrice}/Each`}
              variant="heading"
              extraClasses="!text-black !font-bold !font-inter max-sm:!text-[23px] max-sm:!leading-8 max-sm:!px-5 max-md:!px-[12px]"
            />
            <div className="flex justify-center pt-1">
              <Typography
                text="Add this to your order and"
                variant="heading"
                extraClasses="!text-[#0655b7] !font-bold !text-[27px] !font-inter max-sm:!text-[23px]"
              />
              <Typography
                text="get a 70% discount"
                variant="heading"
                extraClasses="!text-[#eb3f36] !font-bold !pl-2 !text-[27px] !font-inter max-sm:!text-[23px]"
              />
            </div>
          </div>
          <div className="lg:max-w-[1210px] max-sm:w-full flex lg:flex-row max-sm:flex-col-reverse max-md:flex-col-reverse m-auto bg-[#9f9f9f] -mt-16 relative z-10 shadow-[0_0px_7px_1px_rgba(0,0,0,0.3)]">
            <div className="w-1/2 max-sm:w-full max-md:w-full px-1 py-3 bg-white">
              <div className="mx-4">
                <Typography
                  text="Ultra Air Heater"
                  variant="main-heading"
                  extraClasses="!text-black !font-bold !pb-4 max-sm:!py-3 !text-[2rem] !font-inter max-sm:!text-[2rem]"
                />
              </div>
              <div className="flex border-b-[1px] border-[#dadad6] pb-2 mx-4">
                <div className="w-[20%] max-sm:w-[25%] max-md:w-[21%]">
                  <Image className="w-36 pr-2" src={fstars} alt="5 stars" />
                </div>
                <div className="w-[80%] pt-[3px] max-sm:pt-[6px] max-md:pt-[6px]">
                  <Typography
                    text="18,320 ratings"
                    variant="text"
                    extraClasses="!text-[#232630bf] !font-normal !pb-4 max-md:!-mt-[3px] max-lg:!-mt-[3px] max-sm:!-mt-[3px] !text-[0.875rem] !font-inter max-sm:!text-[20px]"
                  />
                </div>
              </div>
              <div className="py-4 border-b-[1px] mx-4 border-[#dadad6] mb-4 pb-6">
                <div className="flex !leading-6">
                  <div className="w-[5%] pt-1 max-md:pt-2 max-sm:pt-[11px]">
                    <div className="rounded-full bg-[#1c50b3] w-[15px] h-[15px]"></div>
                  </div>
                  <div className="w-[95%] pl-2">
                    <Typography
                      text="4 Heating Modes, Built-In Timer & Plugs in Anywhere"
                      variant="text"
                      extraClasses="!text-black !font-normal !leading-6 !text-[0.875rem] max-md:!text-[1.2rem] max-md:!leading-8 !font-inter max-sm:!text-[1.3rem] max-sm:!leading-9"
                    />
                  </div>
                </div>
                <div className="flex !leading-6">
                  <div className="w-[5%] pt-1 max-md:pt-2 max-sm:pt-[11px]">
                    <div className="rounded-full bg-[#1c50b3] w-[15px] h-[15px]"></div>
                  </div>
                  <div className="w-[95%] pl-2">
                    <Typography
                      text="Energy-Efficient Design - Save up to 30% on Heating"
                      variant="text"
                      extraClasses="!text-black !font-normal !leading-6 !text-[0.875rem] max-md:!text-[1.2rem] max-md:!leading-8 !font-inter max-sm:!text-[1.3rem] max-sm:!leading-9"
                    />
                  </div>
                </div>
                <div className="flex !leading-6">
                  <div className="w-[5%] pt-1 max-md:pt-2 max-sm:pt-[11px]">
                    <div className="rounded-full bg-[#1c50b3] w-[15px] h-[15px]"></div>
                  </div>
                  <div className="w-[95%] pl-2">
                    <Typography
                      text="Heats any Space to 80 Degrees in Under 2 Minutes"
                      variant="text"
                      extraClasses="!text-black !font-normal !leading-6 !text-[0.875rem] max-md:!text-[1.2rem] max-md:!leading-8 !font-inter max-sm:!text-[1.3rem] max-sm:!leading-9"
                    />
                  </div>
                </div>
                <div className="flex !leading-6">
                  <div className="w-[5%] pt-1 max-md:pt-2 max-sm:pt-[11px]">
                    <div className="rounded-full bg-[#1c50b3] w-[15px] h-[15px]"></div>
                  </div>
                  <div className="w-[95%] pl-2">
                    <Typography
                      text="Advanced Safety Features for Effortless, Non-Stop Heating"
                      variant="text"
                      extraClasses="!text-black !font-normal !leading-6 !text-[0.875rem] max-md:!text-[1.2rem] max-md:!leading-8 !font-inter max-sm:!text-[1.3rem] max-sm:!leading-9"
                    />
                  </div>
                </div>
              </div>
              <div className="flex pr-[4%] ">
                <div className="w-1/2 border-r-[1px] border-[#dadad6] pt-3">
                  <div className="pb-2">
                    <Typography
                      text="Select Quantity"
                      variant="text"
                      extraClasses="!text-[25px] !text-[#212529] !text-center !font-normal !font-inter"
                    />
                    <Image
                      className="relative left-[82%] max-sm:left-[78%] max-md:left-[75%] bottom-[23px] h-7 w-4 ml-2"
                      src={arrimg}
                      alt="arrow image"
                    />
                  </div>
                  <div className="pt-2">
                    <Typography
                      text="Retail Price"
                      variant="text"
                      extraClasses="!text-[21px] !text-[#212529] !text-end !font-normal !font-inter !px-8 !pb-4"
                    />
                    <div className="relative ml-auto w-fit">
                      <Typography
                        text={`$${retailPrice}`}
                        variant="text"
                        extraClasses="!text-[42px] w-fit !text-[#5a5c64] !text-end !font-extrabold !font-inter !px-4 !pb-4 "
                      />
                      <div className="before:absolute before:left-[16px] before:top-1/2 before:-translate-y-1/2 before:-rotate-[10deg] before:w-[80%] before:h-[2px] before:bg-[#f60002]"></div>
                    </div>
                    <Typography
                      text="+ $12.99 SHIPPING"
                      variant="text"
                      extraClasses="!text-[13px] !text-[#f60002] !line-through !text-end !font-bold !font-inter !px-8 !pb-4"
                    />
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="flex gap-1 px-2 border-[1px] rounded-md -m-2 bg-white p-2">
                    {["1", "2", "3", "4", "5"]
                      .slice(0, maxCount)
                      .map((item, ind) => (
                        <Button
                          text={item}
                          variant="contained-square-white"
                          className={`${
                            ind + 1 === quantity
                              ? "bg-[#1e6da5] text-[#d7e7ff]"
                              : "bg-[#d7e7ff] text-[#1e6da5]"
                          }  rounded-md text-[20px]  font-medium w-[19%] py-[5px] px-[10px]`}
                          key={ind}
                          name={`select-quantity-${ind}`}
                          onClick={() => setQuantity(ind + 1)}
                        />
                      ))}
                  </div>
                  <div className="pt-[33px]">
                    <div className="flex pl-4">
                      <Typography
                        text="Offer Price"
                        variant="text"
                        extraClasses="!text-[18px] !text-[#212529] !text-start !font-normal !font-inter !pb-4"
                      />
                      <Typography
                        text="(70% OFF)"
                        variant="text"
                        extraClasses="!text-[16px] !text-[#20ab55] !text-start !font-normal !font-inter !pl-[3px] !pb-4"
                      />
                    </div>
                    <Typography
                      text={`$${productPrice}`}
                      variant="text"
                      extraClasses="!text-[42px] !text-black !text-start !font-extrabold !font-inter !px-6 !pb-4"
                    />
                    <Typography
                      text="+ FREE SHIPPING"
                      variant="text"
                      extraClasses="!text-[13px] !text-[#20ab55] !text-start !font-bold !font-inter !pl-11 !pb-4"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center pt-3 pb-6">
                <Button
                  text="Yes! Add To My Order!"
                  variant="contained-square-white"
                  className="bg-[#292aac] p-4 px-7 rounded-md text-[25px] text-white font-medium animate-pulse"
                  onClick={addToMyOrder}
                  name="heater-add-to-order"
                />
              </div>
              <div className="flex border-2 border-[#1f4ba2] rounded-md p-2 pl-6">
                <div className="w-[10%]">
                  <Image className="w-16" src={image5} alt="image" />
                </div>
                <div className="w-[90%] pl-4">
                  <Typography
                    text="All orders ship from the USA 🇺🇸 via USPS within 1 business day. A tracking number will be issued to your email."
                    variant="text"
                    extraClasses="!font-normal max-sm:!text-[19px] max-sm:!leading-8"
                  />
                </div>
              </div>
            </div>
            <div className="w-1/2 max-sm:w-full max-md:w-full p-5 bg-[#dee2e6]">
              <div className="overflow-hidden w-500 h-400 relative">
                <Image
                  src={images[activeImg]}
                  alt="image"
                  width={600}
                  className="transition-transform duration-500 ease-in-out transform max-md:w-[760px]"
                />
              </div>
              <div className="flex flex-row gap-2 pt-5 pb-16 justify-between">
                {images.map((src, ind) => (
                  <div
                    key={ind}
                    onClick={() => setActiveImg(ind)}
                    className="cursor-pointer"
                  >
                    <Image src={src} alt="image" />
                  </div>
                ))}
              </div>
              <div className="border-t-[1px] border-[#dadad6] flex justify-center">
                <Typography
                  text="Guaranteed Safe Checkout"
                  variant="text"
                  extraClasses="!text-[#333] !-mt-3 !w-1/2 !font-bold !text-center !pb-4 !bg-[#e3e2e2] !text-[1.2rem] max-sm:!text-[1rem] !font-montserrat"
                />
              </div>
              <div className="w-10/12 m-auto">
                <Image src={gimg} alt="images" />
              </div>
            </div>
          </div>
          <div className="flex w-2/3 max-sm:w-full max-md:w-full m-auto items-center justify-center ">
            <div className="flex justify-center items-center gap-2">
              <span className="w-[18px] h-[19px] text-[12px] relative  text-white bg-[#232630bf] rounded-full font-bold pl-[4.3px] pb-[2px] pt-[1px]">
                X
              </span>
              <Link
                href={`/offers/${type}/fsaver?${searchParams}`}
                className="bg-[transparent] mt-4 w-full font-normal text-[#232630bf] text-[17px] max-sm:text-[19px] underline underline-offset-1 h-10 rounded-[3px] font-montserrat"
              >
                No thank you, I don’t want to take advantage of this one-time
                offer
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};
export default SwHeater;
