"use client";

import Image from "next/image";
import React from "react";
import model from "../../public/assets/images/top-model.png";
import { Button, Container, Typography } from ".";
import { CAMPAIGN_ID } from "@/constants";
import Link from "next/link";

const HomeBanner = () => {
  return (
    <div className="bg-master-slide bg-cover bg-center bg-no-repeat min-h-[740px] -mt-24 flex flex-col justify-center relative">
      <Container>
        <div className="flex flex-col lg:flex-row mt-24">
          <div className="flex flex-1 flex-col justify-center gap-4  ">
            <Typography
              variant="main-heading"
              text="WE PROVIDE A RANGE OF ECO-FRIENDLY PRODUCTS AND SERVICES DESIGNED FOR SMART, SUSTAINABLE LIVING WITHIN THE COMFORT OF YOUR HOME."
              extraClasses="!text-[24px] xl:!text-[35px] leading-[36px] xl:leading-[48px] tracking-[2px]"
            />
            <Typography
              variant="text"
              text="Opting for lower energy consumption not only diminishes greenhouse gas emissions but also contributes to the conservation of our planet's resources. Our intelligent products ensure you can maintain your accustomed comfort and convenience while making environmentally savvy choices."
              extraClasses="!text-base !font-normal"
            />
            <Link href={`products?category=all&campaignId=${CAMPAIGN_ID}`}>
              <Button
                variant="contained-square-white"
                text="SHOP NOW"
                className="bg-[#197317] hover:bg-green text-white font-semibold w-[210px] p-5 mt-4"
                name="shopNow"
              />
            </Link>
          </div>
          <div className="flex-1">
            <Image src={model} alt="model" width={650} height={650} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomeBanner;
