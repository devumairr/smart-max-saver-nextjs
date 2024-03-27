import { transformFormData } from "@/helpers";
import { http } from "@/http";

export const importClick = async function (data: {
  [key: string]: string | number | boolean;
}): Promise<any> {
  const body: string = transformFormData(data);

  const response = http(
    "?call_type=landers_clicks_import&corp_type=garnet",
    "POST",
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  );

  return response;
};
