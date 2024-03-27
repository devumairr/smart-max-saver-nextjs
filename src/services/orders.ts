import { transformFormData } from "@/helpers";
import { http } from "@/http";

export const leadsImport = async function (data: {
  [key: string]: string | number | boolean;
}): Promise<any> {
  const body: string = transformFormData(data);

  const response = http(
    "?call_type=leads_import&corp_type=garnet",
    "POST",
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  );

  return response;
};

export const orderImport = async function (data: {
  [key: string]: string | number | boolean;
}): Promise<any> {
  const body: string = transformFormData(data);

  const response = http(
    "?call_type=order_import&corp_type=garnet",
    "POST",
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  );

  return response;
};

export const transactionsConfirmPaypal = async function (data: {
  [key: string]: string | number | boolean;
}): Promise<any> {
  const body: string = transformFormData(data);

  const response = http(
    "?call_type=transactions_confirmPaypal&corp_type=garnet",
    "POST",
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  );

  return response;
};

export const orderQuery = async function (data: {
  [key: string]: string | number | boolean;
}): Promise<any> {
  const body: string = transformFormData(data);

  const response = http(
    "?call_type=order_query&corp_type=garnet",
    "POST",
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  );

  return response;
};

export const upsaleImport = async function (data: {
  [key: string]: string | number | boolean;
}): Promise<any> {
  const body: string = transformFormData(data);

  const response = http(
    "?call_type=upsale_import&corp_type=garnet",
    "POST",
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  );

  return response;
};

export const addCoupon = async function (data: {
  [key: string]: string | number | boolean;
}): Promise<any> {
  const body: string = transformFormData(data);

  const response = http(
    "?call_type=order_coupon&corp_type=garnet",
    "POST",
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  );

  return response;
};
