import { http } from "@/http";
import { transformFormData } from "@/helpers";

export const fetchProducts = async function (data: {
  [key: string]: string | number | boolean;
}): Promise<any> {
  const body: string = transformFormData(data);

  const response = http(
    "?call_type=campaign_query&corp_type=garnet",
    "POST",
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  );

  return response;
};
