/* eslint-disable no-unused-vars */
"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import {
  Container,
  FeaturedProductsSlider,
  HomeBanner,
  Typography
} from "@/components";

import { CAMPAIGN_ID } from "@/constants";
import { fetchProducts, importClick } from "@/services";

import EnergySaver from "../../public/assets/images/banner-01.jpg";
import Laundry from "../../public/assets/images/banner-02.jpg";
import Gagdets from "../../public/assets/images/banner-03.jpg";
import arrow from "../../public/assets/images/bi_arrow-right.png";

import "swiper/css";
import "swiper/css/navigation";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

enum CATEGORIES {
  ENERGY_SAVING = "Energy Saving",
  LAUNDRY = "Laundry",
  GADGETS = "Gagdets"
}

type CategoriesType = {
  image: StaticImageData;
  name: CATEGORIES;
  link: string;
};

const categories: CategoriesType[] = [
  {
    image: EnergySaver,
    name: CATEGORIES.ENERGY_SAVING,
    link: "/products?category=energy-saving"
  },
  {
    image: Laundry,
    name: CATEGORIES.LAUNDRY,
    link: "/products?category=laundry"
  },
  {
    image: Gagdets,
    name: CATEGORIES.GADGETS,
    link: "/products?category=gadgets"
  }
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const Home = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<any>([]);

  const handleSession = useCallback(async () => {
    const url = `${pathname}?${searchParams}`;

    const sessionId = localStorage.getItem("sessionId");

    const data: any = {
      pageType: "presellPage"
    };

    if (sessionId) {
      data["sessionId"] = sessionId;
    } else {
      data["campaignId"] = CAMPAIGN_ID;
      data["requestUri"] = `${siteUrl}${url}`;
    }

    const { message, result } = await importClick(data);

    if (result === "ERROR" && message === "session expired") {
      localStorage.removeItem("sessionId");
      handleSession();
    } else if (!sessionId && message.sessionId) {
      localStorage.setItem("sessionId", message.sessionId);
    }
  }, [pathname, searchParams]);

  const hanldeProducts = useCallback(async () => {
    const {
      message: {
        data: {
          [CAMPAIGN_ID]: { products }
        }
      }
    } = await fetchProducts({ campaignId: CAMPAIGN_ID });
    setAllProducts(products);
  }, []);

  useEffect(() => {
    handleSession();
  }, [handleSession]);

  useEffect(() => {
    hanldeProducts();
  }, [hanldeProducts]);

  const filteredProducts = allProducts.filter((product: any) =>
    ["StopWatt", "Esaver Watt", "Laundry Balls", "Dryer Balls"].includes(
      product.productName
    )
  );

  return (
    <div className="w-full">
      {/* <BannerSlider /> */}
      <HomeBanner />
      <Container extraClasses="py-10">
        <div className="px-4">
          <Typography
            variant="heading"
            text="products CATEGORIES"
            extraClasses="!font-bold text-start mb-12 !uppercase "
          />
        </div>
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-8 lg:px-5">
          {categories.map(({ name, image, link }, index) => {
            return (
              <Link
                key={`product-category-${index + 1}`}
                className="w-full h-[520px] relative group overflow-hidden cursor-pointer"
                href={link}
              >
                <div className="w-full h-full bg-black opacity-[2%] absolute inset-0 group z-20" />
                <Image
                  className="w-full h-full group-hover:scale-110 transition-all ease-in-out duration-500"
                  src={image}
                  alt="product category"
                />
                <div className="absolute top-0 left-0 z-0 cursor-pointer">
                  <Typography
                    text={name}
                    variant="heading"
                    extraClasses=" w-[100%] !text-[28px] !bg-transparent !text-[#000] !font-semibold  z-[99] !p-5 !pb-0 !uppercase"
                  />
                  <Typography
                    text="View Products"
                    variant="heading"
                    extraClasses="w-[100%] !text-[17px] !bg-transparent !text-[#257c24]  z-[99] !p-5 !pt-0 !pb-0 !-mt-1"
                  />
                  <Image
                    className="relative left-36 bottom-[29px]"
                    src={arrow}
                    alt="arrow"
                  />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="pt-24 pb-8 px-4">
          <Typography
            variant="heading"
            text="popular products"
            extraClasses="!font-bold text-start mb-12 !uppercase"
          />
          <div className="relative max-sm:mx-3">
            <BsChevronLeft className="product-arrow-left text-2xl text-shape-grey absolute top-1/2 -left-12 -translate-y-full hover:text-primary transition-all ease-in-out duration-300 cursor-pointer z-10 max-sm:-left-5 max-sm:text-lg" />
            <BsChevronRight className="product-arrow-right text-2xl text-shape-grey absolute top-1/2 -right-12 -translate-y-full hover:text-primary transition-all ease-in-out duration-300 cursor-pointer z-10 max-sm:-right-5 max-sm:text-lg" />
            <FeaturedProductsSlider products={filteredProducts} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
