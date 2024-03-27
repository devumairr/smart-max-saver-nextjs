"use client";

import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Container,
  Typography,
  Button,
  FullScreenLoader,
  ProgressLoader
} from "@/components";

import {
  fetchProducts,
  importClick,
  orderQuery,
  upsaleImport
} from "@/services";
import { useAlert } from "@/hooks";
import { ES_OFFER_CAMPAIGN_ID, SW_OFFER_CAMPAIGN_ID } from "@/constants";

import ticimg from "../../../../public/assets/images/check.png";
import primg from "../../../../public/assets/images/mw-product-1.png";
import bgarrow from "../../../../public/assets/images/arrow.png";
import { ES_OFFER, SW_OFFER } from "@/constants/offers";

const DownSell: FC<any> = ({ type }): ReactElement => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showAlert } = useAlert();
  const OFFER_CAMPAIGN_ID =
    (type === ES_OFFER && ES_OFFER_CAMPAIGN_ID) ||
    (type === SW_OFFER && SW_OFFER_CAMPAIGN_ID) ||
    "";
  const PRODUCT_CAMPAIGN_ID =
    (type === ES_OFFER && 141) || (type === SW_OFFER && 160) || "";
  const orderId = searchParams.get("orderId");

  const productType = {
    productName:
      (type === ES_OFFER && "ESaver Watt") ||
      (type === SW_OFFER && "StopWatt") ||
      ""
  };

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [product, setProduct] = useState<any>({});
  const [myOrderProduct, setMyOrderProduct] = useState<any>({});

  const handleSession = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      call_type: "landers_clicks_import",
      pageType: "upsellPage2",
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

      const upsellProduct = products.find((product: any) => {
        return (
          product.campaignProductId === PRODUCT_CAMPAIGN_ID &&
          product.productType === "UPSALE"
        );
      });

      setProduct(upsellProduct);
    }
  }, [OFFER_CAMPAIGN_ID, PRODUCT_CAMPAIGN_ID]);

  const getOrders = useCallback(async () => {
    const data: any = {
      call_type: "order_query",
      orderId
    };

    const { message, result } = await orderQuery(data);

    if (result === "SUCCESS") {
      const {
        data: {
          0: { items }
        }
      } = message;

      const orderedProduct = Object.keys(items).map((itemKey: any) => {
        return items[itemKey];
      })[0];

      setMyOrderProduct(orderedProduct);
    }
  }, [orderId]);

  const addAdditionalProduct = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      call_type: "upsale_import",
      productId: product.campaignProductId,
      productQty: product.maxOrderQty,
      orderId,
      sessionId
    };

    setIsProcessing(true);

    const { result, message } = await upsaleImport(data);

    if (result === "SUCCESS") {
      setIsProcessing(false);
      router.push(`/offers/${type}/heater?${searchParams}`);
    }

    if (result === "ERROR") {
      setIsProcessing(false);
      showAlert({
        type: "error",
        title: message,
        onOk: (MySwal) => {
          MySwal.clickConfirm();
          router.push(`/offers/${type}/downsell?${searchParams}`);
        }
      });
    }
  }, [orderId, product, router, searchParams, showAlert, type]);

  useEffect(() => {
    handleSession();
  }, [handleSession]);

  useEffect(() => {
    handleProducts();
  }, [handleProducts]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  if (
    Object.keys(myOrderProduct).length === 0 ||
    Object.keys(product).length === 0
  ) {
    return <FullScreenLoader />;
  }

  const { price, maxOrderQty } = product;
  const { qty } = myOrderProduct;

  return (
    <>
      {isProcessing && <ProgressLoader />}
      <div className="bg-[rgba(0,0,0,.8)]">
        <Container extraClasses="!items-center !m-auto !flex !justify-center !min-h-screen">
          <div className="!items-center !flex !flex-col !justify-center">
            <div className="w-full">
              <div className="flex justify-center w-full pb-10 bg-[#0049a1] rounded-t-xl">
                <div className="p-3">
                  <div className="flex justify-center">
                    <div className="bg-[#fde513] lg:w-2/3 sm:w-full md:w-2/3 px-7 py-[5px] rounded-md">
                      <Typography
                        text="WAIT!"
                        variant="heading"
                        extraClasses="!text-blue-800 !text-[40px] !font-extrabold text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <Typography
                      text="You’ll never see prices this low again"
                      variant="text"
                      extraClasses="!text-white !text-[32px] !text-center !pt-7 mb-4 !font-sans !font-bold"
                    />
                    <Typography
                      text={`GET ONE MORE FOR ONLY$${price}`}
                      variant="text"
                      extraClasses="!text-white !text-[18px] !text-center !pb-10 !font-sans !font-normal"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="bg-white w-full rounded-b-xl">
                  <div className="flex justify-center">
                    <div className="border-[1px] rounded-lg flex w-10/12 items-center px-1 py-2 -mt-16 bg-white shadow-lg border-[#cfcfcf]">
                      <div className="w-[10%] flex justify-end">
                        <Image src={ticimg} alt="tic image" />
                      </div>
                      <div className="w-[20%]">
                        <span className="z-10 relative left-[50px] top-[25px] bg-[#ffaf38] text-white p-2 px-3 pt-[7px] rounded-full font-medium">
                          {qty}x
                        </span>
                        <Image
                          className="w-[100px] relative z-0 bottom-3"
                          src={primg}
                          alt="product image"
                        />
                      </div>
                      <div className="w-[70%] pl-6">
                        <div>
                          <Typography
                            text="Current Selection"
                            variant="text"
                            extraClasses="!text-[#0049a1] !text-[17px] !text-start !font-sans !font-bold !leading-8"
                          />
                          <Typography
                            text={`${productType.productName} `}
                            variant="text"
                            extraClasses="!text-black !text-[19px] !text-start !font-sans !font-bold !leading-8"
                          />
                          <Typography
                            text={`${qty}x ${productType.productName} (s)`}
                            variant="text"
                            extraClasses="!text-[#1f1f1f] !text-[17px] !text-start !font-sans !font-[500] !leading-8"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex p-8 pb-0 pt-0 items-center">
                    <div className="w-[30%]">
                      <div className="relative top-[1.25rem] pl-3 z-10">
                        <Typography
                          text="Was $133.26"
                          variant="text"
                          extraClasses="!text-white
                       !text-[17px]
                       !text-start
                       !font-sans
                       !font-[500]
                       !leading-5
                       !drop-shadow-[-1px_1px_0px_rgba(254,13,13,1)] !drop-shadow-[1px_1px_0px_rgba(254,13,13,1)] !drop-shadow-[1px_-1px_0px_rgba(254,13,13,1)]
                       "
                        />
                        <Typography
                          text={`Now $${price}`}
                          variant="text"
                          extraClasses="!text-white !text-[17px] !text-start !font-sans !font-[500] !leading-5"
                        />
                      </div>
                      <div className="relative bottom-[25px] z-0">
                        <Image src={bgarrow} alt="bg arrow" />
                      </div>
                    </div>
                    <div className="w-[70%] pl-8">
                      <span className="z-10 relative left-[120px] top-[15px] bg-[#ffaf38] text-white p-2 px-[11px] pt-[10px] rounded-full font-medium">
                        x{maxOrderQty}
                      </span>
                      <Image
                        className="w-44 relative z-0 bottom-3"
                        src={primg}
                        alt="product image"
                      />
                    </div>
                  </div>
                  <div className="px-14 pt-0">
                    <Button
                      onClick={addAdditionalProduct}
                      text={`Yes, Ship One More for an Additional $${price}`}
                      variant="contained-square-white"
                      extraClasses="!bg-[#0049a1] !shadow-[0_3px_0_#262a68] !w-full !font-bold !px-9 !text-white !text-[20px] h-10 rounded-[4px] font-sans"
                    />
                  </div>
                  <div className="px-14 pt-3 pb-2 bg-[transparent]">
                    <Link href={`/offers/${type}/heater?${searchParams}`}>
                      <Button
                        text="No, I don't want to add a bonus to my order."
                        variant="contained-square-white"
                        extraClasses="!bg-[transparent] w-full font-lighter !text-[#777] !text-[15px] h-10 rounded-[3px] font-sans hover:text-[#777] "
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default DownSell;
