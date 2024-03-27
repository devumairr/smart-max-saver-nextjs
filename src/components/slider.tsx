"use client";

import { FC, ReactElement, useCallback, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import { Button, Container, ProductCard, Typography } from ".";

import { CAMPAIGN_ID } from "@/constants";
import { importClick } from "@/services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const BannerSlider: FC = (): ReactElement => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    handleSession();
  }, [handleSession]);

  return (
    <Swiper
      slidesPerView={1}
      navigation={{ nextEl: ".arrow-right", prevEl: ".arrow-left" }}
      modules={[Navigation]}
      loop
    >
      <button className="arrow-left grid place-items-center bg-black opacity-50 w-10 h-10 rounded-full absolute top-1/2 left-8 z-10 hover:bg-primary transition-all ease-in-out duration-300 max-sm:top-2/3 max-sm:left-2">
        <BsChevronLeft className="text-white" size={12} />
      </button>
      <button className="arrow-right grid place-items-center bg-black opacity-50 w-10 h-10 rounded-full absolute top-1/2 right-8 z-10 hover:bg-primary transition-all ease-in-out duration-300 max-sm:top-2/3 max-sm:right-2">
        <BsChevronRight className="text-white" size={12} />
      </button>
      {Array.from({ length: 3 }).map((_, index: number) => {
        return (
          <SwiperSlide key={`slide-${index + 1}`}>
            <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
            <div className="bg-main-slider bg-cover bg-center bg-no-repeat max-sm:min-h-[400px] max-md:min-h-[500px] min-h-[600px] flex flex-col justify-center">
              <Container extraClasses="max-sm:mb-10 max-md:mb-6">
                <Typography
                  variant="heading"
                  text="We provide a range of eco-friendly products and services designed for smart, sustainable living within the comfort of your home."
                  extraClasses="max-w-[850px] mx-auto mb-3 text-white !font-extrabold text-center uppercase relative max-md:mb-8"
                />
                <Typography
                  variant="text"
                  text="Opting for lower energy consumption not only diminishes greenhouse gas emissions but also contributes to the conservation of our planet's resources. Our intelligent products ensure you can maintain your accustomed comfort and convenience while making environmentally savvy choices."
                  extraClasses="max-w-[850px] mx-auto mb-5 text-sm !font-normal text-white text-center !leading-5 relative max-md:hidden"
                />
                <div className="flex justify-center relative">
                  <Button
                    name="Shop-now"
                    text="Shop now"
                    variant="contained-pill"
                    extraClasses="uppercase"
                  />
                </div>
              </Container>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export const FeaturedProductsSlider: FC<{ products: IProduct[] }> = ({
  products
}) => {
  return (
    <Swiper
      slidesPerView={1}
      breakpoints={{
        1280: {
          slidesPerView: 4
        },
        1024: {
          slidesPerView: 3
        },
        640: {
          slidesPerView: 2
        }
      }}
      navigation={{
        nextEl: ".product-arrow-right",
        prevEl: ".product-arrow-left"
      }}
      spaceBetween={12}
      modules={[Navigation]}
      loop
    >
      {products.map((product, index: number) => {
        return (
          <SwiperSlide key={`slide-${index + 1}`}>
            <ProductCard product={product} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
