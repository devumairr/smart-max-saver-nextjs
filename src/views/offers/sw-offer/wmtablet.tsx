"use client";
import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import { Container, Typography, Button, ProgressLoader } from "@/components";
import Image from "next/image";

import tablet from "../../../../public/assets/images/tablet.png";
import img1 from "../../../../public/assets/images/img1.png";
import img2 from "../../../../public/assets/images/img2.png";
import bene1 from "../../../../public/assets/images/tab-bene1.png";
import bene2 from "../../../../public/assets/images/tab-bene2.png";
import bene3 from "../../../../public/assets/images/tab-bene3.png";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from "@/hooks";
import { fetchProducts, importClick, upsaleImport } from "@/services";
import { ES_OFFER_CAMPAIGN_ID, SW_OFFER_CAMPAIGN_ID } from "@/constants";
import Link from "next/link";
import { ES_OFFER, SW_OFFER } from "@/constants/offers";

const SwWmtablet: FC<any> = ({ type }): ReactElement => {
  const [remoteProduct, setRemoteProduct] = useState<any>({});
  const searchParams = useSearchParams();
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
      pageType: "upsellPage6",
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
        return product.productId === 5 && product.productType === "UPSALE";
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
      router.push(`/offers/${type}/thank-you?${searchParams}`);
    }

    if (result === "ERROR") {
      setIsProcessing(false);
      showAlert({
        type: "error",
        title: message,
        onOk: (MySwal) => {
          MySwal.clickConfirm();
          router.push(`/offers/${type}/wmtable?${searchParams}`);
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
    <Container extraClasses="!max-w-full !m-0 !p-0">
      {isProcessing && <ProgressLoader />}
      <div className="flex justify-center pt-5">
        <div className="py-[10px] w-fit p-10 bg-[#eb3f36] flex justify-center">
          <Typography
            text="Limited Time New Customer Discount"
            variant="text"
            extraClasses="!text-white !font-medium !text-[16px] !font-inter"
          />
        </div>
      </div>

      <div className="py-[10px] w-full flex justify-center">
        <div className="w-1/4"></div>
        <div className="w-1/2">
          <h1 className="mt-3 text-center font-bold text-[29px]">
            Save Money on your Energy Bills while Ensuring your Clothes are
            Clean and Fresh.
          </h1>
        </div>
        <div className="w-1/4"></div>
      </div>

      <div className="lg:flex w-2/3 m-auto py-1">
        <div className="w-3/5">
          <Typography
            text="Dirty washing machines can lead to increased electricity bills and costly repairs. Washing machine cleaning tablets remove buildup caused by laundry products, making your machine more efficient and saving you money. Clean machines also ensure effective cleaning and reduce the need for additional cycles, saving electricity, water, and time. Regular use of washing machine cleaning tablets extends your machine's lifespan, saving you money in the long run. Simply add one or two tablets to your washing machine and run it on the hottest cycle for a clean and fresh machine. Save money and reduce your carbon footprint today!"
            variant="text"
            extraClasses="!font-medium !text-[16px] "
          />
          <p className="!pt-5 !font-bold !text-[30px] ">
            <span className="line-through text-slate-300">$99.95 </span>
            <span className="pl-2 pb-10"> $24.95 </span>
          </p>
          <Button
            className="w-full bg-[#00BFF0] text-white font-bold text-[22px] p-5  hover:!bg-red-300"
            variant="contained-square-white"
            text="Yes, Add This to My Order"
            onClick={addToMyOrder}
            name="add-to-my-order"
          />
        </div>
        <div className="w-2/5">
          <Image src={tablet} alt="tablet" />
        </div>
      </div>

      <div className="lg:flex w-2/3 m-auto py-1 pt-20 justify-center">
        <div className="w-full ">
          <hr className="border-2 border-[#00BFF0]" />
          <h1 className="mt-3 text-center font-bold text-[29px] pt-5">
            The easiest, most affordable way to keep your washing machine fresh
            and clean for everyday use
          </h1>
        </div>
      </div>

      <div className="lg:flex w-2/3 m-auto py-1 pt-10 pb-20">
        <div className="w-2/5 flex flex-col items-center relative">
          <Image src={img1} alt="img1" />
          <Button
            extraClasses="absolute -bottom-4 w-3/4 !bg-[#00BFF0] hover:!bg-red-300 text-white font-bold !text-[16px] !p-5"
            variant="contained-square-white"
            text="Yes, Add This to My Order"
            onClick={addToMyOrder}
            name="add-to-my-order"
          />

          <span className="absolute -bottom-12 pt-10">
            <a
              href="#"
              className="hover:text-blue-500 hover:underline text-slate-500"
            >
              No, Thanks!
            </a>
          </span>
        </div>
        <div className="w-3/5 grid place-content-center pl-5">
          <Typography
            text="Washing machines are essential for keeping our clothes clean and smelling fresh. However, as time passes, they can start to develop unpleasant odors and become less efficient in cleaning our clothes. In addition to these issues, a dirty washing machine can also consume more electricity, resulting in increased energy bills. Fortunately, using washing machine cleaning tablets can help you save money on both electricity and repair bills"
            variant="text"
            extraClasses="!font-medium !text-[15px] "
          />
        </div>
      </div>

      <div className=" w-full py-1 pt-20 bg-[#f0f0f0]">
        <div className="container mx-auto px-4 pb-10">
          <div className="lg:flex w-2/3 m-auto py-1 pt-10 pb-10">
            <div className="w-2/5 flex flex-col items-center relative">
              <Image
                src={img2}
                alt="img2"
                className="w-[480px] object-contain	"
              />
            </div>
            <div className="w-3/5  pl-5 pt-20">
              <div className="container my-auto pl-20 flex flex-col items-center">
                <Typography
                  text=" Ready to Try the Best Washing Machine Cleaner on the Market?"
                  variant="heading"
                  extraClasses="!font-bold !text-[30px]"
                />
                <Typography
                  text="Using washing machine cleaning tablets is easy. Simply add one or two tablets to your washing machine and run it on the hottest cycle. The tablets will dissolve and remove any buildup inside the machine, eliminating unpleasant odors and ensuring that your machine is clean and fresh.
                        In conclusion, using washing machine cleaning tablets is a simple and effective way to save money on electricity bills, repair bills, and reduce your carbon footprint. By ensuring that your washing machine is clean and free of buildup, you can increase its efficiency, save money, and help protect the environment "
                  variant="text"
                  extraClasses="!font-medium !text-[15px] pt-10 pb-10"
                />
                <Button
                  className=" w-full bg-[#00BFF0] hover:bg-red-300 text-white font-bold text-[16px] p-5 mb-5"
                  text="Yes, Add This to My Order"
                  variant="contained-square-white"
                  onClick={addToMyOrder}
                  name="add-to-my-order"
                />

                <span className=" w-full text-center">
                  <a
                    href="#"
                    className="hover:text-blue-500 hover:underline text-slate-500"
                  >
                    No, Thanks!
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:flex w-2/3 m-auto py-1 pt-10 pb-20">
        <div className="w-2/5 flex flex-col items-center">
          <Image src={tablet} alt="tablet" />
        </div>
        <div className="w-3/5 pl-5 flex flex-col">
          <div className="flex flex-row ">
            <div className="p-2 grid items-center">
              <Image src={bene1} alt="bene1" width={200} height={80} />
            </div>
            <div>
              <Typography
                text="User-friendly: "
                variant="main-heading"
                extraClasses="!font-medium !text-[22px] pl-5"
              />
              <Typography
                text="Cleaning your washing machine is very easy with these cleaner tablets. All you need to do is put one (or two if required) of these tablets into the washer and run a clean washer cycle or a normal cycle."
                variant="text"
                extraClasses="!font-medium !text-[15px] pl-5 pt-5"
              />
            </div>
          </div>
          <div className="flex flex-row pt-10">
            <div className="p-2 grid items-center">
              <Image src={bene2} alt="bene2" width={200} height={80} />
            </div>
            <div>
              <Typography
                text="Eco-friendly: "
                variant="main-heading"
                extraClasses="!font-medium !text-[22px] pl-5"
              />
              <Typography
                text="Washing machine cleaner tablets are eco-friendly products that are made from proprietary, non-toxic mix of detergents and eco-friendly clearning agents. They are completely safe for human use."
                variant="text"
                extraClasses="!font-medium !text-[15px] pl-5 pt-5"
              />
            </div>
          </div>
          <div className="flex flex-row pt-10">
            <div className="p-2 grid items-center">
              <Image src={bene3} alt="bene3" width={200} height={80} />
            </div>
            <div>
              <Typography
                text="Effective: "
                variant="main-heading"
                extraClasses="!font-medium !text-[22px] pl-5"
              />
              <Typography
                text="Washing machine drum cleaners are formulated in a special way so that they can break up the dirt particles and clear the residuces accumulated within the washer from washing the dirty clothes."
                variant="text"
                extraClasses="!font-medium !text-[15px] pl-5 pt-5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex w-2/3 m-auto py-1 pt-10 pb-20">
        <div className="container my-auto pl-20 flex flex-col items-center">
          <Button
            className=" w-3/5 bg-[#00BFF0] hover:bg-red-300 text-white font-bold text-[16px] p-5 mb-5"
            text="Yes, Add This to My Order"
            variant="contained-square-white"
            onClick={addToMyOrder}
            name="add-to-my-order"
          />

          <span className=" w-full text-center">
            <Link
              href={`/offers/${type}/thank-you?${searchParams}`}
              className="hover:text-blue-500 hover:underline text-slate-500"
            >
              No, Thanks!
            </Link>
          </span>
        </div>
      </div>

      <div className="lg:flex w-full bg-black m-auto py-1 pt-10 pb-10">
        <div className="container my-auto pl-20 flex flex-col items-center">
          <Typography
            text="2024 Copyright © StopWatt. All Rights Reserved."
            variant="main-heading"
            extraClasses="!font-medium !text-[22px] pl-10 !text-white"
          />
        </div>
      </div>
    </Container>
  );
};

export default SwWmtablet;
