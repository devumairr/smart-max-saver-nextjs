"use client";
import { Button, Container, FullScreenLoader, Typography } from "@/components";
import { CAMPAIGN_ID, SETUP } from "@/constants";
import { useAlert } from "@/hooks";
import { fetchProducts, importClick } from "@/services";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const ProductDetails = ({ productId: id }: { productId: number }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [count, setCount] = useState(1);
  const [maxCount, setMaxCount] = useState(1);
  const [productLoading, setProductLoading] = useState<boolean>(true);
  const [isProductInCart, setIsProductInCart] = useState<boolean>(false);
  const [remoteProduct, setRemoteProduct] = useState<any>();
  const [productDetail, setProductDetail] = useState<any>({
    productImages: []
  });
  const { showAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    const storedProducts = JSON.parse(
      localStorage.getItem("cart_products") ?? "[]"
    );
    const findProduct: any = storedProducts.find(
      ({ productId }: IProduct) => productId === productDetail.productId
    );
    setIsProductInCart(!!findProduct);
    if (findProduct) setCount(findProduct.maxOrderQty || 1);
  }, [productDetail.productId]);

  const handleProducts = async () => {
    const {
      message: { data }
    } = await fetchProducts({ campaignId: CAMPAIGN_ID });

    const productsData = data[CAMPAIGN_ID]?.products || [];
    const filteredProducts = productsData.filter(
      ({ productId }: { productId: number }) => {
        return productId === Number(id);
      }
    );
    setMaxCount(filteredProducts.length);
    setRemoteProduct(filteredProducts[count - 1]);
    setProductLoading(false);
  };

  useEffect(() => {
    handleProducts();
  }, [count]);

  const handleSession = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      call_type: "landers_clicks_import",
      pageType: "presellPage",
      sessionId
    };

    await importClick(data);
  }, []);

  useEffect(() => {
    handleSession();
  }, [handleSession]);

  useEffect(() => {
    const findProduct = SETUP.find(
      (setup) => Number(setup.id) === remoteProduct?.productId
    );
    const mergedProductProperties = { ...remoteProduct, ...findProduct };
    if (findProduct) {
      setProductDetail(mergedProductProperties);
    }

    if (isProductInCart) {
      addToCart(mergedProductProperties);
    }
  }, [remoteProduct]);

  const addToCart = (item: IProduct) => {
    setIsProductInCart(true);
    const storedProducts = JSON.parse(
      localStorage.getItem("cart_products") ?? "[]"
    );

    const updatedProducts = isProductInCart
      ? storedProducts.map((p: IProduct) =>
          p.productId === item.productId ? item : p
        )
      : [...storedProducts, item];

    localStorage.setItem("cart_products", JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event("cart_products_change"));
    if (!isProductInCart) {
      showAlert({
        title: item.productName,
        text: "is added to cart !",
        type: "success"
      });
    }
  };

  const isOutOfStock = useMemo(() => {
    return Number(productDetail.stockQuantity) === 0;
  }, [productDetail.stockQuantity]);

  const buttonText: string = useMemo(() => {
    return isProductInCart ? "Checkout Now" : "Add to Cart";
  }, [isProductInCart]);

  if (productLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="w-full">
      <div className="bg-header-bg bg-cover bg-center bg-no-repeat min-h-[280px] flex flex-col justify-center relative -mt-24">
        <div className="absolute inset-0 z-0" />
        <Container>
          <div className="flex flex-col gap-3">
            <Typography
              variant="main-heading"
              text="PRODUCT DETAILS"
              extraClasses="!text-black !font-semibold uppercase !text-center"
            />
          </div>
        </Container>
      </div>
      <div>
        <Container>
          <div className="flex items-center gap-2 pt-[30px] pl-8">
            <Link href="/">
              <Typography
                variant="main-heading"
                text="Home"
                extraClasses="!text-xs !font-normal hover:text-primary transition-all ease-in-out duration-300"
              />
            </Link>
            <span className="!text-xs">{">"}</span>
            <Link href="/products">
              <Typography
                variant="main-heading"
                text="Products"
                extraClasses=" !text-xs !font-normal hover:text-primary transition-all ease-in-out duration-300"
              />
            </Link>
            <span className=" !text-xs">{">"}</span>
            <Typography
              variant="main-heading"
              text={productDetail?.productName}
              extraClasses="!text-xs text-secondary !font-normal hover:text-primary transition-all ease-in-out duration-300"
            />
          </div>
          <div className="flex flex-wrap flex-col sm:flex-row gap-4 justify-between py-[25px] sm:py-[75px]">
            <div className="w-[100%] sm:w-[53%]">
              <div className="flex flex-col-reverse md:flex-row justify-between gap-8">
                <div className="flex flex-row md:flex-col gap-2">
                  {productDetail.productImages?.map(
                    (src: string, ind: number) => (
                      <div
                        key={ind}
                        onClick={() => setSelectedImg(ind)}
                        className={`cursor-pointer hover:border-[3px] hover:border-grey hover:border-solid transition-all ease-in-out duration-300 
                     ${
                       ind === selectedImg
                         ? "border-[3px] border-grey border-solid"
                         : "border-[3px] border-grey border-transparent"
                     }`}
                      >
                        <Image
                          src={src}
                          width={90}
                          height={90}
                          alt="product-img"
                        />
                      </div>
                    )
                  )}
                </div>
                <div className="flex-1 transition-all ease-in-out duration-300">
                  <Image
                    src={
                      (productDetail.productImages &&
                        productDetail.productImages[selectedImg]) ||
                      ""
                    }
                    width={500}
                    height={500}
                    alt="product-img"
                  />
                </div>
              </div>
            </div>
            <div className="bg-yellow flex-1 mt-4 sm:mt-0">
              <Typography
                variant="heading"
                text={productDetail?.productName}
                extraClasses="text-[24px]"
              />
              <Typography
                variant="heading"
                text={`NOW at $${Number(productDetail?.price * count).toFixed(
                  2
                )}`}
                extraClasses="text-[20px]"
              />
              <div className="flex flex-col sm:flex-row gap-4 items-center mt-2">
                <div className="flex border border-solid border-gray rounded">
                  <Button
                    variant="contained-square-white"
                    text="-"
                    extraClasses="!bg-light-gray hover:!bg-primary !text-xl rounded-tl rounded-bl"
                    onClick={() =>
                      setCount((prev) => (prev !== 1 ? prev - 1 : prev))
                    }
                  />
                  <div className="w-[50px] text-center my-auto bg-white">
                    {count}
                  </div>
                  <Button
                    variant="contained-square-white"
                    text="+"
                    extraClasses="!bg-light-gray hover:!bg-primary !text-xl rounded-tr rounded-br"
                    onClick={() =>
                      setCount((prev) => (prev !== maxCount ? prev + 1 : prev))
                    }
                  />
                </div>
                <Button
                  text={isOutOfStock ? "Out Of Stock" : buttonText}
                  variant="contained-pill-white"
                  extraClasses={`min-w-[50%] py-3 ${
                    isProductInCart ? "bg-primary text-white" : ""
                  }`}
                  disabled={isOutOfStock}
                  onClick={() => {
                    isProductInCart
                      ? router.push("/checkout")
                      : addToCart(productDetail);
                  }}
                />
              </div>
              <div
                className="border-t-2 border-solid border-t-gray mt-10 pt-10 text-grey text-[15px]"
                dangerouslySetInnerHTML={{ __html: productDetail?.description }}
              />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ProductDetails;
