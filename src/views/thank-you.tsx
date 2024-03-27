"use client";

import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { Container, FullScreenLoader, Typography } from "@/components";

import { orderQuery } from "@/services";
import { formatDate } from "@/helpers";

import CustomerService from "../../public/assets/images/cs-img.png";
import { SETUP } from "@/constants";

const ThankYou: FC = (): ReactElement => {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [orderDetails, setOrderDetails] = useState<any>({
    dateCreated: "",
    emailAddress: "",
    currencySymbol: "",
    shippingPrice: "",
    totalDiscount: "",
    totalAmount: "",
    subTotal: 0,
    products: []
  });

  const getOrders = useCallback(async () => {
    const data: any = {
      call_type: "order_query",
      orderId
    };

    const { message, result } = await orderQuery(data);

    if (result === "SUCCESS") {
      const {
        data: {
          0: {
            emailAddress,
            items,
            currencySymbol,
            dateCreated,
            totalAmount,
            totalDiscount
          }
        }
      } = message;

      const allItems = Object.keys(items).map((itemKey: any) => {
        return items[itemKey];
      });

      const orderedProducts = allItems.filter(
        (product: any) => product.name !== "Shipping Fee"
      );

      const shippingPrice =
        allItems.find((product) => product.name === "Shipping Fee")?.[
          "price"
        ] || 0;

      const subTotal = orderedProducts.reduce((total, { price }) => {
        return total + Number(price);
      }, 0);

      setOrderDetails({
        dateCreated: formatDate(new Date(dateCreated)),
        emailAddress,
        currencySymbol,
        shippingPrice,
        totalDiscount,
        totalAmount,
        subTotal,
        products: orderedProducts
      });
    }
  }, [orderId]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const {
    dateCreated,
    emailAddress,
    currencySymbol,
    shippingPrice,
    totalDiscount,
    totalAmount,
    subTotal,
    products
  } = orderDetails;

  const combineArray: any = [];
  products.forEach((remoteProduct: any) => {
    const localMatch = SETUP.find((localProduct) => {
      return (
        remoteProduct.name.split(" ")[0].toLowerCase() ===
        localProduct.productName.split(" ")[0].toLowerCase()
      );
    });

    if (localMatch) {
      combineArray.push({
        ...remoteProduct,
        imageUrl: localMatch.productImages[0]
      });
    } else {
      combineArray.push({
        ...remoteProduct
      });
    }
  });

  if (products.length === 0) {
    return <FullScreenLoader />;
  }

  return (
    <div className="w-full">
      {/* BANNER */}
      <div className="bg-thankyou-banner bg-cover bg-no-repeat min-h-[280px] flex flex-col justify-center relative">
        <Container>
          <div className="flex flex-col gap-3">
            <Typography
              variant="main-heading"
              text="Confirmation"
              extraClasses="!text-white !font-semibold uppercase"
            />
            <div className="flex items-center gap-1">
              <Link href="/">
                <Typography
                  variant="text"
                  text="Home"
                  extraClasses="!text-white !font-normal"
                />
              </Link>
              <Typography
                variant="text"
                text="> Confirmation"
                extraClasses="!text-white !font-normal"
              />
            </div>
          </div>
        </Container>
      </div>
      {/* THANK YOU CONTENT */}
      <div className="w-full py-16">
        <Container>
          <Typography
            variant="main-heading"
            text="THANK YOU!"
            extraClasses="!text-neutral-800 !font-medium text-center uppercase mb-4"
          />
          <Typography
            variant="text"
            text="Your Order has been placed"
            extraClasses="!text-zinc-500 !text-base !font-normal text-center mb-4"
          />
          <Typography
            variant="text"
            text={`You will receive an email confirmation shortly at ${emailAddress}`}
            extraClasses="!text-zinc-500 !text-base !font-normal text-center"
          />
          <Typography
            variant="text"
            text="Please Check Your Spam/ Junk Mail Folder"
            extraClasses="!text-zinc-500 !text-base !font-normal text-center mb-4"
          />
          <Typography
            variant="text"
            text={`Order Date: ${dateCreated}`}
            extraClasses="!text-zinc-500 !text-base !font-normal text-center"
          />
          <div className="border border-y-neutral-200 border-x-0 mt-4">
            <div className="grid grid-cols-7 border border-x-neutral-200 border-t-0">
              <Typography
                variant="text"
                text="ITEM ORDER"
                extraClasses="p-4 col-span-3"
              />
              <Typography
                variant="text"
                text="PRICE"
                extraClasses="p-4 col-span-2"
              />
              <Typography
                variant="text"
                text="SUB TOTAL"
                extraClasses="p-4 col-span-2"
              />
            </div>
            <div className="border border-x-neutral-200 border-y-0 py-4">
              {combineArray.map((product: any, index: number) => {
                return (
                  <div
                    key={`cartProduct-${index + 1}`}
                    className="grid grid-cols-7 mb-3"
                  >
                    <div className="flex items-center gap-3 px-4 col-span-3">
                      <div className="w-[80px] h-[110px] bg-neutral-200 relative">
                        <Image
                          fill
                          className="object-contain"
                          src={product.imageUrl}
                          alt={product?.productName}
                        />
                      </div>
                      <Typography
                        variant="text"
                        text={`${product.name}`}
                        extraClasses="!text-zinc-500 !font-normal"
                      />
                    </div>
                    <div className="flex items-center px-4 col-span-2">
                      <Typography
                        variant="text"
                        text={`${currencySymbol}${product?.price}`}
                        extraClasses="!text-zinc-500 !font-normal"
                      />
                    </div>
                    <div className="flex items-center px-4 col-span-2">
                      <Typography
                        variant="text"
                        text={`${currencySymbol}${product?.price}`}
                        extraClasses="!text-zinc-500 !font-normal"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7 border border-x-neutral-200 border-b-0 p-2">
              <div className="col-span-3" />
              <div className="col-span-2 flex flex-col items-end px-4 gap-2">
                <Typography
                  variant="text"
                  text="Subtotal:"
                  extraClasses="!text-neutral-800 !text-base !font-normal"
                />
                <Typography
                  variant="text"
                  text="Discount Price:"
                  extraClasses="!text-red-500 !text-base !font-normal"
                />
                <Typography
                  variant="text"
                  text="Shipping Fee:"
                  extraClasses="!text-neutral-800 !text-base !font-normal"
                />
                <Typography
                  variant="text"
                  text="Total:"
                  extraClasses="!text-neutral-800 !text-base !font-normal"
                />
              </div>
              <div className="col-span-2 flex flex-col px-4 gap-2">
                <Typography
                  variant="text"
                  text={`${currencySymbol}${Number(subTotal).toFixed(2)}`}
                  extraClasses="!text-neutral-800 !text-base !font-normal"
                />
                <Typography
                  variant="text"
                  text={`-${currencySymbol}${totalDiscount}`}
                  extraClasses="!text-red-500 !text-base !font-normal"
                />
                <Typography
                  variant="text"
                  text={`${currencySymbol}${shippingPrice}`}
                  extraClasses="!text-neutral-800 !text-base !font-normal"
                />
                <Typography
                  variant="text"
                  text={`${currencySymbol}${totalAmount}`}
                  extraClasses="!text-neutral-800 !text-base !font-normal"
                />
              </div>
            </div>
          </div>
          <div className="border border-neutral-200 p-6 my-4">
            <Typography
              variant="text"
              text='To make sure that our Customer Service e-mails are not filtered into your "junk" or "bulk" folder, please add support@smartmaxsaver.com to your list of trusted senders. This is very important for keeping you informed of your order.'
              extraClasses="!text-zinc-500 !text-base !font-normal text-center"
            />
          </div>
          <div className="flex items-center gap-3 border border-neutral-200 p-6">
            <Image
              src={CustomerService}
              alt="customer service"
              className="w-28 h-28 object-contain"
            />
            <div className="flex-1">
              <Typography
                variant="text"
                text="We are here to help you"
                extraClasses="!text-black !text-2xl !font-normal"
              />
              <Typography
                variant="text"
                text="If you have any questions or concerns, don't hesitate to reach out to our amazing Customer Service Team."
                extraClasses="!text-zinc-500 !text-base !font-normal"
              />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ThankYou;
