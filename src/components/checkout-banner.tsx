"use client";

import React, { FC, ReactElement, useCallback, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Container, Typography } from "@/components";

import { CAMPAIGN_ID } from "@/constants";
import { importClick } from "@/services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const CheckoutBanner: FC = (): ReactElement => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSession = useCallback(async () => {
    const url = `${pathname}?${searchParams}`;

    const data: any = {
      call_type: "landers_clicks_import",
      pageType: "checkoutPage",
      fraudPixel: "1",
      campaignId: CAMPAIGN_ID,
      requestUri: `${siteUrl}${url}`
    };

    const {
      message: { sessionId },
      result
    } = await importClick(data);

    const isSessionId = localStorage.getItem("sessionId");
    if (result === "SUCCESS" && isSessionId) {
      localStorage.setItem("sessionId", sessionId);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    handleSession();
  }, [handleSession]);

  return (
    <div className="bg-header-bg bg-cover bg-center bg-no-repeat min-h-[280px] flex flex-col justify-center relative -mt-24">
      <div className="absolute inset-0 z-0" />
      <Container>
        <div className="flex flex-col gap-3">
          <Typography
            variant="main-heading"
            text="Checkout"
            extraClasses="!font-semibold uppercase !text-black !text-center"
          />
        </div>
      </Container>
    </div>
  );
};

export default CheckoutBanner;
