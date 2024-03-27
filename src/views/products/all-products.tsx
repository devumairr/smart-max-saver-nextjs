"use client";

import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Container,
  FullScreenLoader,
  ProductCard,
  Typography
} from "@/components";

import { CAMPAIGN_ID, SETUP } from "@/constants";
import { fetchProducts, importClick } from "@/services";

const AllProduct: FC = (): ReactElement => {
  const searchParams = useSearchParams();
  const route = useRouter();
  const selectedCategory: string = searchParams.get("category") ?? "all";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);

  const handleSession = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      call_type: "landers_clicks_import",
      pageType: "presellPage",
      sessionId
    };

    await importClick(data);
  }, []);

  const handleProducts = useCallback(async () => {
    const {
      message: { data }
    } = await fetchProducts({ campaignId: CAMPAIGN_ID });

    const productsData = data[CAMPAIGN_ID]["products"];

    const filteredProducts = productsData.filter(
      ({ maxOrderQty }: { maxOrderQty: number }) => {
        return maxOrderQty === 1;
      }
    );

    filteredProducts.pop();

    setProducts(filteredProducts);
  }, []);

  useEffect(() => {
    handleSession();
  }, [handleSession]);

  useEffect(() => {
    handleProducts();
  }, [handleProducts]);

  useEffect(() => {
    if (products.length > 0) {
      const filtered: IProduct[] = [];
      SETUP.forEach((setup) => {
        const remoteProduct: IProduct | undefined = products.find(
          (product: IProduct) => {
            return setup.productName === product.productName;
          }
        );

        if (remoteProduct) {
          filtered.push({
            ...remoteProduct,
            productTags: setup.productTags
          });
        }
      });

      const finalProducts: IProduct[] =
        selectedCategory === "all"
          ? filtered
          : filtered.filter((product) => {
              return product.productTags.includes(selectedCategory);
            });

      setAllProducts(finalProducts);
    }
  }, [selectedCategory, products]);

  if (products.length === 0 || allProducts.length === 0)
    return <FullScreenLoader />;

  return (
    <div className="w-full pb-10">
      <div className="bg-header-bg bg-cover bg-center bg-no-repeat min-h-[240px] flex flex-col justify-center relative -mt-24">
        <div className="absolute inset-0 bg-black opacity-0 z-0" />
        <Container>
          <div className="flex flex-col gap-3">
            <Typography
              variant="main-heading"
              text="SHOP"
              extraClasses="!text-black !font-semibold uppercase text-center"
            />
          </div>
        </Container>
      </div>
      <div className="w-full pt-12">
        <Container>
          <div className="flex flex-col">
            {/* <div className="w-52">
          <Typography
              text="Categories"
              variant="heading"
              extraClasses="!text-zinc-800 !text-lg !font-extrabold"
            />
             <div className="flex flex-col gap-2 mt-5">
              {[
                { text: "All", link: "all" },
                { text: "Energy Saving", link: "energy-saving" },
                { text: "Laundry", link: "laundry" },
                { text: "Gadgets", link: "gadgets" }
              ].map(({ text, link }) => {
                return (
                  <Link
                    scroll={false}
                    className={`${
                      selectedCategory === link
                        ? "text-primary"
                        : "text-black"
                    } hover:text-primary transition-all ease-in-out duration-300`}
                    key={link}
                    href={`/products/?category=${link}`}
                    id={`category-link-${link}`}
                  >
                    {text}
                  </Link>
                );
              })}
            </div>
          </div> */}
            <div className="pb-16 flex max-sm:justify-center sm:justify-center md:justify-center lg:justify-start">
              <select
                className="px-3 pr-24 py-4 border-[1px] border-[#dfdfdf] max-sm:w-full md:w-[30rem] sm:w-[30rem] lg:w-[19rem]"
                name="SHOP BY CATEGORIES"
                id="cars"
                value={searchParams.get("category") || ""}
                onChange={(e) =>
                  route.push(`/products/?category=${e.target.value}`)
                }
              >
                {/* <option value="SHOP BY CATEGORIES">
                  SHOP BY CATEGORIES
                </option> */}
                <option value="all">All</option>
                <option value="energy-saving">Energy Saving</option>
                <option value="laundry">Laundry</option>
                <option value="gadgets">Gadgets</option>
              </select>
            </div>
            <div className="flex-1 grid lg:grid-cols-4 gap-8 max-sm:grid-cols-1 md:grid-cols-2">
              {allProducts.map((product) => {
                return (
                  <ProductCard
                    product={product}
                    key={product.productId}
                    showTwoButtons
                  />
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AllProduct;
