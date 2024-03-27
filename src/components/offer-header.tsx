"use client";

import React, { FC, ReactElement, useCallback, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Container, Typography } from "@/components";

import { SW_OFFER_CAMPAIGN_ID } from "@/constants";
import { importClick } from "@/services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const OfferHeader: FC = (): ReactElement => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSession = useCallback(async () => {
    const url = `${pathname}?${searchParams}`;

    const data: any = {
      call_type: "landers_clicks_import",
      pageType: "checkoutPage",
      fraudPixel: "1",
      campaignId: SW_OFFER_CAMPAIGN_ID,
      requestUri: `${siteUrl}${url}`
    };

    await importClick(data);
  }, [pathname, searchParams]);

  useEffect(() => {
    handleSession();
  }, [handleSession]);

  return (
    <div className="w-full bg-gray-700">
      <Container>
        <Typography
          text="60 DAYS MONEY BACK GUARANTEE - LIMITED TIME OFFER 65% OFF"
          variant="text"
          extraClasses="!text-white !text-lg !font-bold text-center uppercase"
        />
      </Container>
    </div>
  );
};

export default OfferHeader;
