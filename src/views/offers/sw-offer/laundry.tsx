"use client";
import React, { useCallback, useEffect, useState } from "react";
import slide1 from "../../../../public/assets/images/laundry-slide-1.webp";
import slide2 from "../../../../public/assets/images/laundry-slide-2.webp";
import slide3 from "../../../../public/assets/images/laundry-slide-3.webp";
import slide4 from "../../../../public/assets/images/laundry-slide-4.webp";
import slide5 from "../../../../public/assets/images/laundry-slide-5.webp";
import MoneyBack from "../../../../public/assets/images/money-back-gurantee.webp";
import SecureBadge from "../../../../public/assets/images/secure-badge.webp";
import Check from "../../../../public/assets/images/check.webp";
import Image from "next/image";
import { Button, ProgressLoader, Typography } from "@/components";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from "@/hooks";
import { fetchProducts, importClick, upsaleImport } from "@/services";
import { ES_OFFER_CAMPAIGN_ID, SW_OFFER_CAMPAIGN_ID } from "@/constants";
import { ES_OFFER, SW_OFFER } from "@/constants/offers";
const data = [
  {
    text: "STOP buying and lugging around bottles and boxes of laundry detergent."
  },
  {
    text: "The OdorCrush laundry ball uses bioceramic beads to clean clothes without any harmful chemicals like sulfates, phosphates, benzenes, etc."
  },
  {
    text: "The OdorCrush laundry balls are very easy to use, just put them into the washer with dirty clothes, without worrying about spills or other hassles."
  },
  {
    text: "Each ball lasts over 1000 washes! That's a lot of time, money, and hassle you're saving!"
  }
];
const Laundry = ({ type }: any) => {
  const [remoteProduct, setRemoteProduct] = useState<any>({});
  const searchParams = useSearchParams();
  const slides = [slide1, slide2, slide3, slide4, slide5];
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleSlideClick = (index: number) => {
    setCurrentSlide(index);
  };
  const router = useRouter();
  const { showAlert } = useAlert();
  const OFFER_CAMPAIGN_ID =
    (type === ES_OFFER && ES_OFFER_CAMPAIGN_ID) ||
    (type === SW_OFFER && SW_OFFER_CAMPAIGN_ID) ||
    "";
  const orderId = searchParams.get("orderId");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSession = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      call_type: "landers_clicks_import",
      pageType: "upsellPage5",
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
        return product.productId === 3 && product.productType === "UPSALE";
      });
      setRemoteProduct(upsellProduct[0]);
    }
  }, [OFFER_CAMPAIGN_ID]);

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
      router.push(`/offers/${type}/wmtablet?${searchParams}`);
    }

    if (result === "ERROR") {
      setIsProcessing(false);
      showAlert({
        type: "error",
        title: message,
        onOk: (MySwal) => {
          MySwal.clickConfirm();
          router.push(`/offers/${type}/laundry?${searchParams}`);
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
    <div className="font-roboto">
      {isProcessing && <ProgressLoader />}
      <div className="flex items-center justify-between bg-[#D20A0A] ">
        <Typography
          text="Limited Time New Customer Discount"
          variant="text"
          extraClasses="!text-[#FDD000] !text-[16px] text-center w-full p-[6px] font-light"
        />
      </div>
      <div className="bg-[#1B6DC1] text-center p-3 p-md-3">
        <Typography
          text="The Green Alternative to Laundry Detergent"
          variant="heading"
          extraClasses="!text-[#F6F30A] text-center w-full p-2 !font-medium text-[1.8rem]"
        />
      </div>
      <div className="container mx-auto py-5 px-8 sm:px-8 md:px-8 lg:px-10 xl:px-20 2xl:px-40">
        <div className="flex flex-col sm:flex-col md:flex-row items-start gap-6 ">
          <div className="flex flex-col flex-1">
            <div className="px-6">
              <Image
                src={slides[currentSlide]}
                alt=""
                width={450}
                height={400}
              />
            </div>
            <div className="flex justify-start mt-4">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`mx-5 cursor-pointer ${
                    index === currentSlide && "border-2 rounded"
                  }`}
                  onClick={() => handleSlideClick(index)}
                >
                  <Image src={slide} alt="" width={65} height={65} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <ul className="mt-4 text-[16px]" style={{ listStyleType: "disc" }}>
              <li>Eco Friendly and Chemical Free</li>
              <li>Save Hundreds of Dollars a Year</li>
              <li>Stop Buying Laundry Detergent Forever</li>
              <li>No Refills Needed! Use it Again & Again!</li>
            </ul>
            <h4 className="text-[19px] font-semibold">
              Save Hundreds for Only <span className="text-[28px]">$19.92</span>{" "}
            </h4>
            <Button
              text="YES! ADD THIS TO MY ORDER"
              variant="contained-square-white"
              extraClasses="!p-[20px] !mt-2 !bg-[#42BD32] !text-[16px] !hover:bg-[#42BD32] !text-center !text-white !font-semibold !w-[90%] !rounded-[10px]"
              onClick={addToMyOrder}
              name="addToMyOrder"
            />
            <Link
              href={`/offers/${type}/wmtablet?${searchParams}`}
              className="text-center mt-4 underline font-medium"
            >
              No, Thanks. I’ll pass on this special offer.
            </Link>
            <div className="flex gap-2 mt-4">
              <Image src={MoneyBack} alt="" width={65} height={60} />
              <Typography
                variant="text"
                extraClasses="!font-normal"
                text="Your purchase is backed by our 100% Money Back Guarantee . If you are not happy with the results, we will refund your money - no questions asked."
              />
            </div>
            <div className="mt-4 flex justify-center items-center gap-1">
              <hr className="w-[30%] border-[1.5px] border-[#212529]" />
              <Typography
                variant="text"
                extraClasses="!font-semibold !text-[16px] w-2/5 text-center"
                text="Guaranteed Safe Checkout"
              />
              <hr className="w-[30%] border-[1.5px] border-[#212529]" />
            </div>
            <div className="w-[70%] mx-auto mt-1">
              <Image src={SecureBadge} alt="" width={1000} height={1000} />
            </div>
          </div>
        </div>
        <hr className="my-5" />
        <div>
          <Typography
            variant="heading"
            text="Save the Environment While Saving Money!"
            extraClasses="!font-semibold !text-[28px]"
          />
          <div className="mt-2">
            {data.map((item, index) => (
              <div key={index} className="mt-2">
                <div className="flex gap-2 items-center mb-2">
                  <Image src={Check} alt="" width={35} height={35} />
                  <Typography
                    variant="text"
                    text={item.text}
                    extraClasses="!text-base !font-normal"
                  />
                </div>
              </div>
            ))}
          </div>
          <hr className="my-5" />
          <div className="row">
            <div className="flex items-center justify-center flex-col col-md-4">
              <Button
                text="YES! ADD THIS TO MY ORDER"
                variant="contained-square-white"
                extraClasses="!p-[20px] !mt-2 !bg-[#42BD32] !text-[16px] !hover:bg-[#42BD32] !text-center !text-white !font-semibold !w-[350px] !rounded-[10px]"
                onClick={addToMyOrder}
                name="addToMyOrder"
              />
            </div>
            <div className="flex items-center justify-center flex-col col-md-4">
              <Link
                href={`/offers/${type}/wmtablet?${searchParams}`}
                className="text-center mt-4 underline font-medium"
              >
                No, Thanks. I’ll pass on this special offer.
              </Link>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-10" />
      <div className="mb-6">
        <Typography
          text="Copyright © 2024 StopWatt. All Rights Reserved."
          variant="text"
          extraClasses="text-center !font-light !text-[16px]"
        />
      </div>
    </div>
  );
};
export default Laundry;
