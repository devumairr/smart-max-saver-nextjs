"use client";
import { CAMPAIGN_ID } from "@/constants";
import { importClick } from "@/services";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const ConfigSession = () => {
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
    if (result === "SUCCESS") {
      localStorage.setItem("sessionId", sessionId);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    handleSession();
  }, [handleSession]);
  return <div></div>;
};

export default ConfigSession;
