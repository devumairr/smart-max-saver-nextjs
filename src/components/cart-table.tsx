"use client";

import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import Image from "next/image";

import { Button, TextInput, Typography } from ".";

import CrossIcon from "../../public/assets/images/remove.svg";
import { useRouter } from "next/navigation";
import { useAlert } from "@/hooks";
import { addCoupon } from "@/services/orders";
import { CAMPAIGN_ID } from "@/constants";

const CartTable: FC<any> = ({ shippingObj }): ReactElement => {
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [couponVal, setCouponVal] = useState<string>("");
  const [couponLoader, setCouponLoader] = useState<boolean>(false);
  const route = useRouter();
  const { showAlert } = useAlert();

  const areItemsInCart = useMemo((): boolean => {
    return cartProducts.length > 0;
  }, [cartProducts]);

  const subTotal = useMemo((): number => {
    return cartProducts.reduce(
      (total, { price, maxOrderQty }) => total + Number(price * maxOrderQty),
      0
    );
  }, [cartProducts]);

  const discountTotal = useMemo((): number => {
    return cartProducts.reduce(
      (total, { coupon }) => total + Number(coupon?.priceDiscount || 0),
      0
    );
  }, [cartProducts]);

  const total = useMemo((): number => {
    if (discountTotal > 0) {
      return subTotal - Number(discountTotal);
    }
    return subTotal + Number(shippingObj.price);
  }, [subTotal, shippingObj, discountTotal]);

  const getStoredProducts = useCallback(() => {
    return JSON.parse(localStorage.getItem("cart_products") ?? "[]");
  }, []);

  const setStoredProducts = useCallback(
    (products = getStoredProducts()) => {
      localStorage.setItem("cart_products", JSON.stringify(products));
      window.dispatchEvent(new Event("cart_products_change"));
    },
    [getStoredProducts]
  );

  const removeProduct = useCallback(
    (productId: string) => {
      const storedProducts = getStoredProducts();
      const updatedProducts = storedProducts.filter(
        (product: any) => product.productId !== productId
      );

      if (updatedProducts.length === 0) {
        localStorage.removeItem("coupon_code");
      }

      setCartProducts(updatedProducts);
      setStoredProducts(updatedProducts);
    },
    [getStoredProducts, setStoredProducts]
  );

  const applyCoupon = useCallback(
    async (alreadyApplied?: boolean) => {
      if (!alreadyApplied && !couponVal) {
        return showAlert({
          type: "error",
          text: "Please enter a coupon code",
          title: "Coupon Code"
        });
      }

      const couponText = alreadyApplied
        ? localStorage.getItem("coupon_code")
        : couponVal;
      setCouponLoader(true);
      const promises = getStoredProducts()
        .filter((item: any) => !item.hasOwnProperty("coupon"))
        .map((item: any, ind: number) => {
          const details: any = {
            call_type: "order_coupon",
            campaignId: CAMPAIGN_ID,
            couponCode: couponText,
            [`product${ind + 1}_id`]: item.campaignProductId,
            [`product${ind + 1}_qty`]: item.productQty
          };

          return getProductWithCoupon(details, item);
        });

      try {
        const productsWithCoupon = await Promise.all(promises);
        const alreadyAddedCoupon = getStoredProducts().filter((item: any) =>
          item.hasOwnProperty("coupon")
        );
        const latestProducts = [...alreadyAddedCoupon, ...productsWithCoupon];
        localStorage.setItem("cart_products", JSON.stringify(latestProducts));
        if (couponText !== null) {
          localStorage.setItem("coupon_code", couponText);
        }
        window.dispatchEvent(new Event("cart_products_change"));
        setCartProducts(latestProducts);
      } catch (err: any) {
        showAlert({
          type: "error",
          title: err.message
        });
      } finally {
        setCouponVal("");
        setCouponLoader(false);
      }
    },
    [couponVal, getStoredProducts, showAlert]
  );

  useEffect(() => {
    const storedProducts: any[] = getStoredProducts();

    const isCouponNotApplied = storedProducts.every((product: any) => {
      return !product.hasOwnProperty("coupon");
    });
    const hasCouponInAllproducts = storedProducts.every((product: any) => {
      return product.hasOwnProperty("coupon");
    });

    if (isCouponNotApplied || hasCouponInAllproducts) {
      setCartProducts(storedProducts);
    } else {
      applyCoupon(true);
    }
  }, [getStoredProducts]);

  const getProductWithCoupon = async (details: any, item: any) => {
    const { message, result } = await addCoupon(details);

    if (result === "SUCCESS") {
      if (message.priceDiscount === 0) throw new Error("Invalid Coupon");

      return {
        ...item,
        coupon: message
      };
    }

    return item;
  };

  return (
    <div className="w-full">
      <div className="border border-y-neutral-200 border-x-0">
        <div className="grid grid-cols-7 border border-x-neutral-200 border-t-0">
          <Typography
            variant="text"
            text="PRODUCT"
            extraClasses="p-4 col-span-3"
          />
          <Typography
            variant="text"
            text="PRICE"
            extraClasses="p-4 col-span-2"
          />
          <Typography
            variant="text"
            text="TOTAL"
            extraClasses="p-4 col-span-2"
          />
        </div>
        <div className="border border-x-neutral-200 border-y-0 py-4">
          {!areItemsInCart ? (
            <Typography
              variant="text"
              text="No Item on cart"
              extraClasses="p-4 !text-base !font-normal"
            />
          ) : (
            <div className="w-full">
              {cartProducts.map((cartProduct: any, index: number) => {
                const discountPrice =
                  cartProduct.coupon !== undefined
                    ? cartProduct.coupon.priceDiscount
                    : 0;
                return (
                  <div
                    key={`cartProduct-${index + 1}`}
                    className="grid grid-cols-7 mb-3"
                  >
                    <div className="flex items-center gap-3 px-4 col-span-3">
                      <div className="w-[80px] h-[110px] bg-neutral-50 relative">
                        <Image
                          fill
                          className="object-contain"
                          src={cartProduct.imageUrl}
                          alt={cartProduct?.productName}
                        />
                        <Image
                          className="w-4 h-4 object-contain absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 cursor-pointer"
                          src={CrossIcon}
                          onClick={() => removeProduct(cartProduct?.productId)}
                          alt="remove icon"
                        />
                      </div>
                      <Typography
                        variant="text"
                        text={`${cartProduct?.productName} X ${cartProduct.maxOrderQty}`}
                        extraClasses="!text-zinc-500 !font-normal"
                      />
                    </div>
                    <div className="flex items-center px-4 col-span-2">
                      <Typography
                        variant="text"
                        text={`$${cartProduct?.price}`}
                        extraClasses="!text-zinc-500 !font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center px-4 col-span-2">
                      <Typography
                        variant="text"
                        text={`$${(
                          cartProduct?.price * cartProduct.maxOrderQty
                        ).toFixed(2)}`}
                        extraClasses={`${
                          discountPrice > 0 ? "line-through" : ""
                        } !text-zinc-500 !font-normal`}
                      />
                      {discountPrice > 0 && (
                        <Typography
                          variant="text"
                          text={`$${(
                            (cartProduct?.price - discountPrice) *
                            cartProduct.maxOrderQty
                          ).toFixed(2)}`}
                          extraClasses="!text-zinc-500 !font-normal"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              <hr className="mb-4 mx-4" />
              <div className="grid grid-cols-3">
                <div className="col-span-2 flex flex-col items-end px-4 gap-2">
                  <Typography
                    variant="text"
                    text={discountTotal > 0 ? "Discount Price:" : "Subtotal:"}
                    extraClasses={`${
                      discountTotal > 0 ? "!text-red-500" : "!text-neutral-800"
                    }  !text-base !font-normal`}
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
                <div className="flex flex-col px-4 gap-2">
                  <Typography
                    variant="text"
                    text={
                      discountTotal > 0
                        ? `-$${discountTotal.toFixed(2)}`
                        : `$${subTotal.toFixed(2)}`
                    }
                    extraClasses={`${
                      discountTotal > 0 ? "!text-red-500" : "!text-neutral-800"
                    }  !text-base !font-normal`}
                  />
                  <Typography
                    variant="text"
                    text={discountTotal > 0 ? "Free" : `$${shippingObj.price}`}
                    extraClasses="!text-neutral-800 !text-base !font-normal"
                  />
                  <Typography
                    variant="text"
                    text={`$${total.toFixed(2)}`}
                    extraClasses="!text-neutral-800 !text-base !font-normal"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-8 py-5 border border-x-neutral-200 border-t-0">
        <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-2.5">
          <TextInput
            variant="outline"
            placeholder="Coupon Code"
            extraClasses="!border-[#4fb633] !p-4 !bg-[#dff5d9]"
            name="coupon-code"
            value={couponVal}
            onChange={(e) => setCouponVal(e.target.value)}
          />
          <Button
            variant="contained-pill-white"
            text={couponLoader ? "..." : "Apply Coupon"}
            extraClasses="uppercase max-sm:!text-[13px] max-sm:!pl-4 !rounded-none !text-black !bg-[#ffd748] max-sm:!py-4"
            name="apply-coupon"
            onClick={() => applyCoupon()}
            disabled={couponLoader || cartProducts.length === 0}
          />
          <Button
            variant="contained-pill-white"
            text="Continue Shopping"
            extraClasses="uppercase max-sm:!text-[13px] max-sm:!pl-4 !rounded-none !text-white !bg-[#197317] max-sm:!py-4"
            name="continue-shopping"
            onClick={() => route.push("/products")}
          />
        </div>
      </div>
    </div>
  );
};

export default CartTable;
