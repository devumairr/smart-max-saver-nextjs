"use client";

import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { ProgressLoader, Select, TextInput, Typography } from ".";

import {
  CAMPAIGN_ID,
  CURRENT_MONTH,
  MONTHS_ARRAY,
  YEARS_ARRAY
} from "@/constants";
import { useAlert } from "@/hooks";
import {
  isCardValid,
  isCvvValid,
  isEmailValid,
  isNumberValid,
  isPostalCodeValid
} from "@/helpers";
import { leadsImport, orderImport } from "@/services";

import PaypalIcon from "../../public/assets/images/paypal-img.png";
import { transactionsConfirmPaypal } from "@/services/orders";

const CartForm: FC<any> = ({ states, countries }): ReactElement => {
  const { showAlert } = useAlert();
  const router = useRouter();
  const searchParams = useSearchParams();

  const paypalAccept = searchParams.get("paypalAccept");
  const token = searchParams.get("token");
  const PayerID = searchParams.get("PayerID");
  const isTestmode = searchParams.get("testmode");

  const [isDebitCardPayment, setIsDebitCardPayment] = useState<boolean>(false);
  const [isBlurred, setIsBlurred] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    country: "",
    city: "",
    postalCode: ""
  });

  const [billingErrors, setBillingErrors] = useState({
    firstName: true,
    lastName: true,
    address1: true,
    country: true,
    city: true,
    postalCode: true
  });

  const [data, setData] = useState({
    emailAddress: "",
    phoneNumber: "",
    shipFirstName: "",
    shipLastName: "",
    shipAddress1: "",
    shipAddress2: "",
    shipCountry: countries.length === 1 ? countries[0]["id"] : "",
    shipCity: "",
    shipState: "",
    shipPostalCode: "",
    billShipSame: "1"
  });

  const [errors, setErrors] = useState({
    emailAddress: true,
    phoneNumber: true,
    shipFirstName: true,
    shipLastName: true,
    shipAddress1: true,
    shipCountry: countries.length !== 1,
    shipCity: true,
    shipState: true,
    shipPostalCode: true,
    cardNumber: true,
    cardMonth: true,
    cardSecurityCode: true,
    cardYear: true
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardMonth: "",
    cardSecurityCode: "",
    cardYear: ""
  });

  const handleBillingChange = (
    key: keyof typeof billingData,
    value: string
  ) => {
    const errorsObj: any = {};

    if (key === "postalCode") {
      errorsObj[key] = !isPostalCodeValid(value);
    }

    const stringValidationKeys = ["address1", "city", "country"];

    if (stringValidationKeys.includes(key)) {
      const isFieldValid = !!value.trim();
      errorsObj[key] = !isFieldValid;
    }

    const nonNumKeys = ["firstName", "lastName"];

    if (nonNumKeys.includes(key)) {
      const isFieldValid = !!value.trim().replace(/[0-9]/g, "");
      errorsObj[key] = !isFieldValid;
    }

    setBillingErrors({
      ...billingErrors,
      ...errorsObj
    });

    setBillingData((prevData) => ({
      ...prevData,
      [key]: nonNumKeys.includes(key) ? value.replace(/[0-9]/g, "") : value
    }));
  };

  const handleChange = (key: string, value: string) => {
    const errorsObj: any = {};
    if (key === "emailAddress") {
      errorsObj[key] = !isEmailValid(value);
    }

    if (key === "phoneNumber") {
      errorsObj[key] = !isNumberValid(value);
    }

    if (key === "shipPostalCode") {
      errorsObj[key] = !isPostalCodeValid(value);
    }

    if (key === "termPolicy") {
      errorsObj[key] = value === "1" ? false : true;
    }

    const stringValidationKeys = [
      "shipAddress1",
      "shipCity",
      "shipState",
      "shipCountry"
    ];

    if (stringValidationKeys.includes(key)) {
      const isFieldValid = !!value.trim();
      errorsObj[key] = !isFieldValid;
    }

    const nonNumKeys = ["shipFirstName", "shipLastName"];

    if (nonNumKeys.includes(key)) {
      const isFieldValid = !!value.trim().replace(/[0-9]/g, "");
      errorsObj[key] = !isFieldValid;
    }

    setErrors({
      ...errors,
      ...errorsObj
    });

    setData((prevData) => ({
      ...prevData,
      [key]: nonNumKeys.includes(key) ? value.replace(/[0-9]/g, "") : value
    }));
  };

  const handleCardInfo = (key: string, value: string) => {
    const errorsObj: any = {};
    if (key === "cardNumber") {
      if (
        value
          .trim()
          .split("")
          .every((num: string) => Number(num) === 0)
      ) {
        if (value.length >= 13) {
          errorsObj[key] = false;
        } else {
          errorsObj[key] = true;
        }

        setCardInfo((prevData) => ({
          ...prevData,
          [key]: value
        }));

        setErrors({
          ...errors,
          ...errorsObj
        });
        return;
      }

      errorsObj[key] = !isCardValid(value);

      if (value.length >= 4 && !isCardValid(value)) {
        showAlert({
          type: "error",
          title: "Only Visa, Mastercards, Discover and Amex are supported!",
          onOk: (instance) => {
            instance.clickConfirm();

            setErrors({
              ...errors,
              [key]: true
            });

            setCardInfo((prevData) => ({
              ...prevData,
              [key]: ""
            }));
          }
        });

        return;
      }
    }

    if (key === "cardSecurityCode") {
      errorsObj[key] = !isCvvValid(value);
    }

    if (key === "cardYear") {
      const isFieldValid = !!value;
      errorsObj[key] = !isFieldValid;

      if (value === YEARS_ARRAY[0].id && cardInfo.cardMonth < CURRENT_MONTH) {
        errorsObj["cardMonth"] = true;
      }
    }

    if (key === "cardMonth") {
      const isFieldValid = !!value;
      errorsObj[key] = !isFieldValid;

      if (cardInfo.cardYear === YEARS_ARRAY[0].id && value < CURRENT_MONTH) {
        errorsObj[key] = true;
      }
    }

    setErrors({
      ...errors,
      ...errorsObj
    });

    setCardInfo((prevData) => ({
      ...prevData,
      [key]: value
    }));
  };

  const saveOrderDetails = useCallback(async () => {
    setIsBlurred(true);

    const sessionId = localStorage.getItem("sessionId");

    const details: any = {
      ...data,
      call_type: "leads_import",
      campaignId: CAMPAIGN_ID,
      sessionId
    };

    await leadsImport(details);
  }, [data]);

  const completeOrder = useCallback(async () => {
    const products = JSON.parse(localStorage.getItem("cart_products") ?? "[]");

    if (products.length === 0) {
      showAlert({ type: "error", title: "No item on cart!" });

      return;
    }

    const errorsArr = Object.entries({
      ...(data.billShipSame === "0" ? billingErrors : {}),
      ...errors
    })
      .filter((arr) => arr[1])
      .map(([key]) => key);

    if (errorsArr.length > 0) {
      showAlert({
        type: "error",
        title: "Please enter/correct the following required fields",
        text: errorsArr.join(" ,  ")
      });

      return;
    }

    const productsData: any = {};

    products.forEach(
      ({ campaignProductId, price, productQty }: any, index: number) => {
        productsData[`product${index + 1}_id`] = campaignProductId;
        productsData[`product${index + 1}_price`] = price;
        productsData[`product${index + 1}_qty`] = productQty;
      }
    );

    const sessionId = localStorage.getItem("sessionId");

    const details: any = {
      call_type: "order_import",
      campaignId: CAMPAIGN_ID,
      sessionId,
      ...(data.billShipSame === "0" ? { ...billingData } : {}),
      ...data,
      ...productsData,
      ...cardInfo,
      paySource: "CREDITCARD"
    };

    const couponApplied = localStorage.getItem("coupon_code");
    if (couponApplied) {
      details.couponCode = couponApplied;
    }

    const { message, result } = await orderImport(details);

    if (result === "SUCCESS" && message?.orderId) {
      localStorage.removeItem("cart_products");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("coupon_code");
      window.dispatchEvent(new Event("cart_products_change"));

      router.push(`/thank-you?orderId=${message.orderId}`);
    }

    if (result === "ERROR") {
      showAlert({
        type: "error",
        title: message
      });
    }
  }, [data, billingData, router, cardInfo, errors, billingErrors, showAlert]);

  const redirectToPaypal = async () => {
    const products = JSON.parse(localStorage.getItem("cart_products") ?? "[]");
    const couponApplied = localStorage.getItem("coupon_code");
    localStorage.setItem("paypal_Biller_Id", isTestmode ? "9" : "8");

    if (products.length === 0) {
      showAlert({ type: "error", title: "No item on cart!" });

      return;
    }

    const productsData: any = {};

    products.forEach(
      (
        { campaignProductId, price, productQty, shippingPrice }: any,
        index: number
      ) => {
        productsData[`product${index + 1}_id`] = campaignProductId;
        productsData[`product${index + 1}_price`] = price;
        productsData[`product${index + 1}_qty`] = productQty;
        productsData[`product${index + 1}_shipPrice`] = couponApplied
          ? 0
          : shippingPrice;
      }
    );

    const sessionId = localStorage.getItem("sessionId");

    const details: any = {
      call_type: "order_import",
      campaignId: CAMPAIGN_ID,
      sessionId,
      paySource: "PAYPAL",
      paypalBillerId: isTestmode ? 9 : 8,
      salesUrl: window.location.href,
      errorRedirectsTo: window.location.href,
      ...productsData
    };

    if (couponApplied) {
      details.couponCode = couponApplied;
    }

    const { message, result } = await orderImport(details);

    if (result === "SUCCESS") {
      router.push(`${message.paypalUrl}`);
    }
    if (result === "ERROR") {
      showAlert({
        type: "error",
        title: message
      });
    }
  };

  const onPaypalSuccessPurchased = useCallback(async () => {
    const products = JSON.parse(localStorage.getItem("cart_products") ?? "[]");
    const couponApplied = localStorage.getItem("coupon_code");
    const paypalBillerId = localStorage.getItem("paypal_Biller_Id");

    if (products.length === 0) {
      showAlert({ type: "error", title: "No item on cart!" });

      return;
    }

    const productsData: any = {};
    setIsLoading(true);
    products.forEach(
      (
        { campaignProductId, price, productQty, shippingPrice }: any,
        index: number
      ) => {
        productsData[`product${index + 1}_id`] = campaignProductId;
        productsData[`product${index + 1}_price`] = price;
        productsData[`product${index + 1}_qty`] = productQty;
        productsData[`product${index + 1}_shipPrice`] = couponApplied
          ? 0
          : shippingPrice;
      }
    );

    const sessionId = localStorage.getItem("sessionId");

    const details: any = {
      call_type: "transactions_confirmPaypal",
      campaignId: CAMPAIGN_ID,
      sessionId,
      paySource: "PAYPAL",
      paypalBillerId: Number(paypalBillerId),
      paypalAccept: paypalAccept,
      token: token,
      payerId: PayerID,
      salesUrl: window.location.href,
      errorRedirectsTo: window.location.href,
      ...productsData
    };

    if (couponApplied) {
      details.couponCode = couponApplied;
    }

    const { message, result } = await transactionsConfirmPaypal(details);

    if (result === "SUCCESS") {
      setIsLoading(false);
      localStorage.removeItem("cart_products");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("coupon_code");
      localStorage.removeItem("paypal_Biller_Id");
      window.dispatchEvent(new Event("cart_products_change"));
      router.push(`/thank-you?orderId=${message.orderId}`);
    }
    if (result === "ERROR") {
      setIsLoading(false);
      router.push("/checkout");
      showAlert({
        type: "error",
        title: message
      });
    }
  }, [PayerID, isTestmode, paypalAccept]);

  useEffect(() => {
    if (paypalAccept && token && PayerID) {
      onPaypalSuccessPurchased();
    }
  }, [paypalAccept, token, PayerID]);

  const {
    emailAddress,
    phoneNumber,
    shipFirstName,
    shipLastName,
    shipAddress1,
    shipCity,
    shipState,
    shipCountry,
    shipPostalCode,
    cardNumber,
    cardMonth,
    cardSecurityCode,
    cardYear
  } = errors;

  const { firstName, lastName, address1, city, postalCode, country } =
    billingErrors;

  return (
    <>
      {isLoading && <ProgressLoader />}
      <div className="w-full border border-y-neutral-200 p-4 bg-[#197317]">
        <Typography
          variant="heading"
          text="SHIPPING & BILLING INFO"
          extraClasses="!text-xl !font-bold pb-6 !text-[#ffd748]"
        />
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            name="billing_address_confirmation"
            className="mt-1"
            checked={!!Number(data.billShipSame)}
            onChange={(e) => {
              handleChange("billShipSame", e.target.checked ? "1" : "0");
            }}
          />
          <Typography
            variant="text"
            text="Billing Address Same As Shipping"
            extraClasses="!text-sm !font-normal leading-6 !text-white"
          />
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            !Number(data.billShipSame) ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <Typography
            variant="text"
            text="Confirm Billing Address"
            extraClasses="!text-white !text-base !font-normal text-center mt-2"
          />
          <hr className="my-4 border-black/10" />
          <TextInput
            variant="outline"
            placeholder="First Name"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="firstName"
            value={billingData.firstName}
            onChange={(e) => {
              handleBillingChange("firstName", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !firstName}
            isError={isBlurred && firstName}
          />
          <TextInput
            variant="outline"
            placeholder="Last Name"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="lastName"
            value={billingData.lastName}
            onChange={(e) => {
              handleBillingChange("lastName", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !lastName}
            isError={isBlurred && lastName}
          />
          <TextInput
            variant="outline"
            placeholder="Address 1"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="address1"
            onChange={(e) => {
              handleBillingChange("address1", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !address1}
            isError={isBlurred && address1}
          />
          <TextInput
            variant="outline"
            placeholder="Address 2"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="address2"
            onChange={(e) => {
              handleBillingChange("address2", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !!billingData.address2}
            isError={isBlurred && !billingData.address2}
          />
          <Select
            variant="outline"
            options={[{ id: "", label: "-- Select --" }, ...states]}
            extraClasses="!border-neutral-200 !p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="country"
            onChange={(e) => {
              handleBillingChange("country", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !country}
            isError={isBlurred && country}
          />
          <TextInput
            variant="outline"
            placeholder="City"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="city"
            onChange={(e) => {
              handleBillingChange("city", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !city}
            isError={isBlurred && city}
          />
          <TextInput
            variant="outline"
            placeholder="Zip"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            inputMode="numeric"
            pattern="[0-9]*"
            minLength={5}
            maxLength={5}
            name="postalCode"
            onChange={(e) => {
              handleBillingChange("postalCode", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !postalCode}
            isError={isBlurred && postalCode}
          />
        </div>
        <hr className="my-4 border-[#166715]" />
        <TextInput
          variant="outline"
          placeholder="Email Address"
          extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
          type="email"
          name="emailAddress"
          onChange={(e) => {
            handleChange("emailAddress", e.target.value);
          }}
          onBlur={saveOrderDetails}
          isValid={isBlurred && !emailAddress}
          isError={isBlurred && emailAddress}
        />
        <TextInput
          variant="outline"
          placeholder="Phone Number"
          extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
          type="tel"
          pattern="[0-9]*"
          maxLength={10}
          name="phoneNumber"
          onChange={(e) => {
            handleChange("phoneNumber", e.target.value);
          }}
          onBlur={saveOrderDetails}
          isValid={isBlurred && !phoneNumber}
          isError={isBlurred && phoneNumber}
        />
        <div className="flex items-start gap-2 my-2">
          <input
            type="checkbox"
            name="billing_address_confirmation"
            className="mt-1"
          />
          <Typography
            variant="text"
            text="Yes, I consent to receive marketing messages via automated technology at the phone number provided above."
            extraClasses="!text-white !text-xs !font-normal !leading-6"
          />
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <TextInput
            variant="outline"
            placeholder="First Name"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="shipFirstName"
            value={data.shipFirstName}
            onChange={(e) => {
              handleChange("shipFirstName", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !shipFirstName}
            isError={isBlurred && shipFirstName}
          />
          <TextInput
            variant="outline"
            placeholder="Last Name"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="shipLastName"
            value={data.shipLastName}
            onChange={(e) => {
              handleChange("shipLastName", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !shipLastName}
            isError={isBlurred && shipLastName}
          />
          <TextInput
            variant="outline"
            placeholder="Address 1"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="shipAddress1"
            onChange={(e) => {
              handleChange("shipAddress1", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !shipAddress1}
            isError={isBlurred && shipAddress1}
          />
          <TextInput
            variant="outline"
            placeholder="Address 2"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="shipAddress2"
            onChange={(e) => {
              handleChange("shipAddress2", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !!data.shipAddress2}
            isError={isBlurred && !data.shipAddress2}
          />
          <TextInput
            variant="outline"
            placeholder="City"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="shipCity"
            onChange={(e) => {
              handleChange("shipCity", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !shipCity}
            isError={isBlurred && shipCity}
          />
          <Select
            variant="outline"
            options={[{ id: "", label: "-- Select --" }, ...states]}
            extraClasses="!border-neutral-200 !p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="shipState"
            onChange={(e) => {
              handleChange("shipState", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !shipState}
            isError={isBlurred && shipState}
          />
          <TextInput
            variant="outline"
            placeholder="Zip"
            extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            inputMode="numeric"
            pattern="[0-9]*"
            minLength={5}
            maxLength={5}
            name="shipPostalCode"
            onChange={(e) => {
              handleChange("shipPostalCode", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !shipPostalCode}
            isError={isBlurred && shipPostalCode}
          />
          <Select
            variant="outline"
            options={[...countries]}
            extraClasses="!border-neutral-200 !p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
            name="shipCountry"
            onChange={(e) => {
              handleChange("shipCountry", e.target.value);
            }}
            onBlur={saveOrderDetails}
            isValid={isBlurred && !shipCountry}
            isError={isBlurred && shipCountry}
          />
        </div>
        <div className="grid grid-cols-1 my-2 gap-2">
          <button
            className="bg-amber-400 rounded-md pt-4 pb-10 h-5 px-5"
            name="paypal-btn"
            onClick={redirectToPaypal}
          >
            <Image
              src={PaypalIcon}
              alt="paypal icon"
              className="w-full h-7 object-contain"
            />
          </button>
          {/* <PaypalButton /> */}
          <button
            className="bg-zinc-800 rounded-md p-4 flex flex-col items-start"
            onClick={() => {
              setIsDebitCardPayment(true);
            }}
            name="debit-card-payment"
          >
            <Typography
              text="Pay Via"
              variant="heading"
              extraClasses="!text-white !text-base font-medium text-left"
            />
            <Typography
              text="Debit or Credit card"
              variant="text"
              extraClasses="!text-white !text-sm !font-normal text-left"
            />
          </button>
        </div>
        {isDebitCardPayment && (
          <div className="w-full py-1">
            <Typography
              variant="heading"
              text="PAYMENT INFORMATION"
              extraClasses="!text-lg !font-bold mb-1 !text-white"
            />
            <TextInput
              variant="outline"
              placeholder="Card Number"
              extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={16}
              name="cardNumber"
              onChange={(e) => {
                handleCardInfo("cardNumber", e.target.value);
              }}
              value={cardInfo.cardNumber}
              onBlur={() => setIsBlurred(true)}
              isValid={isBlurred && !cardNumber}
              isError={isBlurred && cardNumber}
            />
            <div className="grid grid-cols-2 gap-2">
              <Select
                variant="outline"
                options={[{ label: "YEAR", id: "" }, ...YEARS_ARRAY]}
                extraClasses="!border-neutral-200 !p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
                name="cardYear"
                onChange={(e) => {
                  handleCardInfo("cardYear", e.target.value);
                }}
                value={cardInfo.cardYear}
                onBlur={() => setIsBlurred(true)}
                isValid={isBlurred && !cardYear}
                isError={isBlurred && cardYear}
              />
              <Select
                variant="outline"
                options={[{ label: "MONTH", id: "" }, ...MONTHS_ARRAY]}
                extraClasses="!border-neutral-200 !p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
                name="cardMonth"
                onChange={(e) => {
                  handleCardInfo("cardMonth", e.target.value);
                }}
                onBlur={() => setIsBlurred(true)}
                isValid={isBlurred && !cardMonth}
                isError={isBlurred && cardMonth}
              />
            </div>
            <TextInput
              type="password"
              variant="outline"
              placeholder="CVV"
              extraClasses="!p-4 my-1 !bg-[#197317] !text-[15px] !text-[#fff] placeholder:!text-white"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={3}
              name="cardSecurityCode"
              onChange={(e) => {
                handleCardInfo("cardSecurityCode", e.target.value);
              }}
              onBlur={() => setIsBlurred(true)}
              isValid={isBlurred && !cardSecurityCode}
              isError={isBlurred && cardSecurityCode}
            />
            <button
              className="bg-zinc-800 text-2xl text-white p-4 rounded-md mt-3"
              onClick={completeOrder}
              name="completeOrder"
            >
              COMPELETE ORDER
            </button>
          </div>
        )}
        <div className="flex items-start gap-2 my-2">
          <input
            type="checkbox"
            name="termPolicy"
            className="mt-1"
            onChange={(e) => {
              handleChange("termPolicy", e.target.checked ? "1" : "0");
            }}
          />
          <p className="text-white text-xs font-normal leading-6">
            By clicking above I hereby affirm that I am at least 18 years of age
            and agree to the{" "}
            <Link
              href="/terms-conditions"
              className="text-[#f5aeae] hover:text-red-500 text-[0.625rem] transition-all duration-300 ease-in-out"
              id="terms-and-conditions"
            >
              Terms & Conditions
            </Link>
            . Your personal data will be used to process your order, support
            your experience throughout this website, and for other purposes
            described in our{" "}
            <Link
              href="/privacy-policy"
              className="text-[#f5aeae] hover:text-red-500 text-[0.625rem] transition-all duration-300 ease-in-out"
              id="privacy-policy"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
        <Typography
          text="Charges will appear on your credit card statement as www.smartesaver.com"
          variant="text"
          extraClasses="!text-white !text-sm !font-normal !leading-6 pt-2"
        />
      </div>
    </>
  );
};

export default CartForm;
