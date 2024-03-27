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

import primage from "../../../../public/assets/images/mw-product-1.png";
import cancelimg from "../../../../public/assets/images/cancel.png";
import { ES_OFFER, SW_OFFER } from "@/constants/offers";

const SwUpsell: FC<any> = ({ type }): ReactElement => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showAlert } = useAlert();
  const OFFER_CAMPAIGN_ID =
    (type === ES_OFFER && ES_OFFER_CAMPAIGN_ID) ||
    (type === SW_OFFER && SW_OFFER_CAMPAIGN_ID) ||
    "";
  const PRODUCT_CAMPAIGN_ID =
    (type === ES_OFFER && 140) || (type === SW_OFFER && 159) || "";
  const orderId = searchParams.get("orderId");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [product, setProduct] = useState<any>({});
  const [myOrderProduct, setMyOrderProduct] = useState<any>({});

  const handleSession = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      call_type: "landers_clicks_import",
      pageType: "upsellPage1",
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

  const addBonusProduct = useCallback(async () => {
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

  const productType = {
    productName:
      (type === ES_OFFER && "ESaver Watt") ||
      (type === SW_OFFER && "StopWatt") ||
      ""
  };

  return (
    <>
      {isProcessing && <ProgressLoader />}
      <div className="bg-[rgba(0,0,0,.8)] p-12">
        <Container extraClasses="!items-center flex justify-center min-h-screen">
          <div className="lg:m-auto lg:w-1/2 flex items-center justify-center sm:m-20 sm:w-full md:w-3/4">
            <div className="border-none rounded-lg bg-[#fae500] w-full border-black p-1">
              <Link href={`/offers/${type}/downsell?${searchParams}`}>
                <Image
                  className="w-6 relative left-[99%] bottom-4 border-[1px] rounded-full bg-white cursor-pointer"
                  src={cancelimg}
                  alt="cancel image"
                />
              </Link>
              <Typography
                extraClasses="!font-extrabold font-sans text-center pb-2"
                variant="heading"
                text="WAIT"
              />
              <Typography
                extraClasses="!font-medium text-xl text-center ml-12 mr-12 pb-2"
                variant="heading"
                text={`Inflation Relief: Customers Get an Additional
              ${productType.productName} for only $${price}`}
              />
              <div className="bg-white p-2 pt-5">
                <div className="py-4 rounded-md mx-3 px-0">
                  <div className="border-t-[1px] border-[#b9b9b9] mr-3 ml-3">
                    <Typography
                      extraClasses="!font-bold text-[14px] leading-4 text-center w-1/3 bg-white -mt-2.5 text-center m-auto"
                      variant="heading"
                      text="YOUR ORDER NOW!"
                    />
                  </div>
                  <div>
                    <div className="flex mr-3 ml-3 mt-4">
                      <div className="w-40 border-[#b9b9b9] border-[1px] rounded-md p-5 pt-0">
                        <div className="flex justify-end relative top-7 right-3">
                          <span className="w-9 p-[7px] text-center rounded-full bg-orange-400 text-white font-bold">
                            x{qty}
                          </span>
                        </div>
                        <Image src={primage} alt="product image" />
                      </div>
                      <div>
                        <Typography
                          extraClasses="!font-bold text-[14px] pl-5 pt-10"
                          variant="heading"
                          text={`${productType.productName}`}
                        />
                        <Typography
                          extraClasses="!font-lighter text-[14px] pl-5"
                          variant="heading"
                          text={`${qty} x ${productType.productName}(s)`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#dfe5eb] py-4 rounded-md mx-3 px-0">
                  <div className="border-t-[1px] border-[#b9b9b9] mr-3 ml-3">
                    <Typography
                      extraClasses="!font-bold text-[14px] leading-4 text-center w-1/3 bg-[#dfe5eb] -mt-2.5 text-center m-auto"
                      variant="heading"
                      text="YOUR ORDER BONUS"
                    />
                  </div>
                  <div>
                    <div className="flex mr-3 ml-3 mt-4">
                      <div className="w-40 border-[#b9b9b9] border-[1px] rounded-md p-5 pt-0">
                        <div className="flex justify-end relative top-7 right-3">
                          <span className="w-9 p-[7px] text-center rounded-full bg-orange-400 text-white font-bold">
                            x{maxOrderQty}
                          </span>
                        </div>
                        <Image src={primage} alt="product image" />
                      </div>
                      <div>
                        <Typography
                          extraClasses="!font-bold text-[14px] pl-5 pt-10 pb-0 leading-3"
                          variant="heading"
                          text={`${productType.productName} ${maxOrderQty} x EXTRA Special`}
                        />
                        <Typography
                          extraClasses="!font-bold text-[14px] pl-5 pt-0 !text-green-600"
                          variant="heading"
                          text="Family, Neighbors, Friends, Gifts"
                        />
                        <Typography
                          extraClasses="!font-lighter text-[14px] pl-5"
                          variant="heading"
                          text={`${maxOrderQty} x EXTRA ${productType.productName}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-14 pt-5">
                  <Button
                    onClick={addBonusProduct}
                    text={`Yes, Ship One More for an Additional $${price}`}
                    variant="contained-square-white"
                    extraClasses="!bg-[#11ad52] shadow-[0_3px_0_#0f6a28] w-full font-bold text-white text-[16px] h-10 rounded-[5px] font-sans"
                  />
                </div>
                <div className="px-14 pt-3 pb-2 bg-[transparent]">
                  <Link href={`/offers/${type}/downsell?${searchParams}`}>
                    <Button
                      text="No, I don't want to add a bonus to my order."
                      variant="contained-square-white"
                      extraClasses="!bg-[transparent] w-full font-normal !text-[#777] text-[15px] h-10 rounded-[3px] font-sans !hover:text-[#777] "
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default SwUpsell;
