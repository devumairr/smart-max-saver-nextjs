"use client";

import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button, Typography } from ".";

import { useAlert } from "@/hooks";
import Link from "next/link";

const ProductCard: FC<{
  product: IProduct;
  showTwoButtons?: boolean;
}> = ({ product, showTwoButtons = false }): ReactElement => {
  const { showAlert } = useAlert();
  const router = useRouter();

  const [isProductInCart, setIsProductInCart] = useState<boolean>(false);

  useEffect(() => {
    const storedProducts = JSON.parse(
      localStorage.getItem("cart_products") ?? "[]"
    );

    setIsProductInCart(
      !!storedProducts.find(
        ({ productId }: any) => productId === product.productId
      )
    );
  }, [product.productId]);

  const {
    productName,
    price,
    imageUrl,
    productType,
    stockQuantity,
    productId
  } = product;

  const addToCart = (product: any) => {
    const storedProducts = JSON.parse(
      localStorage.getItem("cart_products") ?? "[]"
    );

    const productsToStore = [...storedProducts, product];
    localStorage.setItem("cart_products", JSON.stringify(productsToStore));

    window.dispatchEvent(new Event("cart_products_change"));

    showAlert({
      title: product.productName,
      text: "is added to cart !",
      type: "success"
    });
  };

  const isOutOfStock = useMemo(() => {
    return Number(stockQuantity) === 0;
  }, [stockQuantity]);

  const buttonText: string = useMemo(() => {
    return isProductInCart ? "Checkout Now" : "Add to Cart";
  }, [isProductInCart]);

  return (
    <div className="w-full">
      <div
        style={{ boxShadow: "0 25px 70px rgba(0, 0, 0, 0.07)" }}
        className="min-h-[380px] flex flex-col justify-center relative overflow-hidden group max-sm:min-h-[280px]"
      >
        <div className="absolute bottom-0 h-0 group-hover:h-full bg-black opacity-25 left-0 right-0 transition-all ease-in-out duration-300 overflow-hidden" />
        <div className="absolute left-0 right-0 flex flex-col items-center gap-2 -bottom-32 group-hover:bottom-5 transition-all ease-in-out duration-300">
          {isProductInCart && (
            <Typography
              text="Added to Cart"
              variant="text"
              extraClasses="!text-neutral-700 !font-normal"
            />
          )}
          <>
            <Button
              name={"Add-to-Cart"}
              text={isOutOfStock ? "Out Of Stock" : buttonText}
              variant="contained-pill-white"
              extraClasses={`min-w-[65%] py-3 hover:!bg-[#e65540] !rounded-none !text-[17px] !bg-black !uppercase ${
                isProductInCart ? "bg-primary text-white" : ""
              }`}
              disabled={isOutOfStock}
              onClick={() => {
                setIsProductInCart(true);
                isProductInCart ? router.push("/checkout") : addToCart(product);
              }}
            />
            {showTwoButtons && (
              <Button
                name={"View-Details"}
                text="View Details"
                variant="contained-pill-white"
                extraClasses={
                  "min-w-[65%] py-3 hover:!bg-[#e65540] !rounded-none !text-[17px] !bg-black !uppercase"
                }
                onClick={() => router.push(`/products/${productId}`)}
              />
            )}
          </>
        </div>
        {productType && (
          <div className="self-start p-3 absolute top-0 left-0">
            <Typography
              text={productType !== "OFFER" ? "New" : "Sale"}
              variant="text-small"
              extraClasses={`${
                productType !== "OFFER" ? "bg-badge" : "bg-primary"
              } !text-white !font-normal uppercase py-1 px-5 select-none w-initial !bg-[#019547]`}
            />
          </div>
        )}
        <Image
          className="w-full h-[300px] object-contain px-5"
          width={100}
          height={300}
          src={imageUrl}
          alt={productName}
        />
      </div>
      <div className="p-3 pb-0">
        <Link href={`/products/${productId}`}>
          <Typography
            variant="text"
            text={productName}
            extraClasses="mb-1.5 text-secondary !font-normal relative hover:text-primary transition-all ease-in-out duration-300"
          />
        </Link>
        <Typography
          variant="text"
          text={`$${price}`}
          extraClasses="!text-secondary !font-normal relative"
        />
      </div>
    </div>
  );
};

export default ProductCard;
