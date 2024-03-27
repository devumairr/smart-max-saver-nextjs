"use client";

import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";

import { PiCaretDoubleRightFill } from "react-icons/pi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import {
  Button,
  Collapse,
  Container,
  GuranteeBadge,
  NotifyPopup,
  OfferHeader,
  PricingCard,
  ProgressLoader,
  Select,
  TextBox,
  TextInput,
  Typography,
  VidepPlayer,
  OfferCoupon
} from "@/components";

import {
  CURRENT_MONTH,
  MONTHS_ARRAY,
  PRODUCT_FEATURES,
  STOPWATT_REVIEWS,
  STOPWATT_BENEFITS,
  STOPWATT_PRICINGS,
  STOPWATT_STEPS,
  STOPWATT_USAGE,
  SW_COUPON_DISCOUNT,
  SW_OFFER_CAMPAIGN_ID,
  YEARS_ARRAY,
  ESAVER_REVIEWS,
  ES_OFFER_CAMPAIGN_ID,
  ESAVER_PRICINGS
} from "@/constants";
import { fetchProducts, leadsImport, orderImport } from "@/services";
import { useAlert } from "@/hooks";
import {
  extractCountries,
  extractStates,
  isCardValid,
  isCvvValid,
  isEmailValid,
  isPostalCodeValid
} from "@/helpers";

import StopWatt from "../../../../public/assets/images/stopwatt.png";
import EsaverWatt from "../../../../public/assets/images/esaver-watt.png";
import Rating from "../../../../public/assets/images/rating.png";
import CreditCards from "../../../../public/assets/images/creadit-cards.png";
import StopwattProduct from "../../../../public/assets/images/stopwatt-product.png";
import EsaverProduct from "../../../../public/assets/images/esaver-prod.png";
import StopwattProductMobile from "../../../../public/assets/images/stopwatt-product-mobile.png";
import EsaverProductMobile from "../../../../public/assets/images/esaver-product-mobile.png";
import Warranty from "../../../../public/assets/images/90-days.png";
import Brenda from "../../../../public/assets/images/brenda-pic.png";
import Rating5Stars from "../../../../public/assets/images/5-stars.png";
import FeaturedLogos from "../../../../public/assets/images/featured-logos.png";
import FeaturedLogosMobile from "../../../../public/assets/images/featured-logos-mobile.png";
import StopwattDisplay from "../../../../public/assets/images/stopwatt-product-display.png";
import MoneyBackGurantee from "../../../../public/assets/images/money-back-guarantee.png";
import LogoWhite from "../../../../public/assets/images/logo-white.png";
import LogoWhiteEsaver from "../../../../public/assets/images/logo-white-esaver.png";
import Paypal from "../../../../public/assets/images/paypal-img.png";
import Card1 from "../../../../public/assets/images/card-1.png";
import Card2 from "../../../../public/assets/images/card-2.png";
import Card3 from "../../../../public/assets/images/card-3.png";
import Card4 from "../../../../public/assets/images/card-4.png";
import Card5 from "../../../../public/assets/images/card-5.png";
import Shipping from "../../../../public/assets/images/icon-shipping.png";
import Badge from "../../../../public/assets/images/footer-badge.png";
import { QUESTIONS, RETURN_FAQS, SHIPPING_FAQS } from "@/constants/questions";
import { ES_OFFER, SW_OFFER } from "@/constants/offers";
import { transactionsConfirmPaypal } from "@/services/orders";
import ConfigSession from "@/components/config-session";

const STARTING_BENEFITS = [...STOPWATT_BENEFITS.slice(0, 4)];
const ENDING_BENEFITS = [...STOPWATT_BENEFITS.slice(4, 8)];

const SwOffer: FC<any> = ({ type }): ReactElement => {
  const { showAlert } = useAlert();
  const router = useRouter();
  const productType = useMemo(() => {
    return {
      productName:
        (type === ES_OFFER && "ESAVER WATT") ||
        (type === SW_OFFER && "STOPWATT") ||
        "",
      productLogo:
        (type === ES_OFFER && EsaverWatt) ||
        (type === SW_OFFER && StopWatt) ||
        "",
      productImg:
        (type === ES_OFFER && EsaverProduct) ||
        (type === SW_OFFER && StopwattProduct) ||
        "",
      productMobileImg:
        (type === ES_OFFER && EsaverProductMobile) ||
        (type === SW_OFFER && StopwattProductMobile) ||
        "",
      bgBox:
        (type === ES_OFFER && "bg-esaver-box") ||
        (type === SW_OFFER && "bg-stopwatt-box") ||
        "",
      productReviews:
        (type === ES_OFFER && ESAVER_REVIEWS) ||
        (type === SW_OFFER && STOPWATT_REVIEWS) ||
        [],
      productCampaignId:
        (type === ES_OFFER && ES_OFFER_CAMPAIGN_ID) ||
        (type === SW_OFFER && SW_OFFER_CAMPAIGN_ID) ||
        "",
      activeOfferIds:
        (type === ES_OFFER && [134, 135, 136]) ||
        (type === SW_OFFER && [153, 154, 155]) ||
        [],
      warrantyOfferIds:
        (type === ES_OFFER && [137, 138, 139]) ||
        (type === SW_OFFER && [156, 157, 158]) ||
        []
    };
  }, [type]);

  const pricingRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const paySourceRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  const paypalAccept = searchParams.get("paypalAccept");
  const token = searchParams.get("token");
  const PayerID = searchParams.get("PayerID");
  const isTestmode = searchParams.get("testmode");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWarrantyApplied, setIsWarrantyApplied] = useState<boolean>(true);
  const [isCouponActivated, setIsCouponActivated] = useState(false);
  const [isBlurred, setIsBlurred] = useState<boolean>(false);
  const [showCardForm, setShowCardForm] = useState<boolean>(false);
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [states, setStates] = useState<IOption[]>([]);
  const [countries, setCountries] = useState<IOption[]>([]);
  const [activeOffers, setActiveOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>({});
  const [isPaySourceSelected, setIsPaySourceSelected] =
    useState<boolean>(false);

  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    state: "",
    city: "",
    postalCode: ""
  });

  const [billingErrors, setBillingErrors] = useState({
    firstName: true,
    lastName: true,
    address1: true,
    state: true,
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
    shipCountry: "",
    shipCity: "",
    shipState: "",
    shipPostalCode: "",
    billShipSame: 1,
    couponCode: ""
  });

  const [errors, setErrors] = useState({
    emailAddress: true,
    phoneNumber: true,
    shipFirstName: true,
    shipLastName: true,
    shipAddress1: true,
    shipCountry: true,
    shipCity: true,
    shipState: true,
    shipPostalCode: true
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardMonth: "",
    cardSecurityCode: "",
    cardYear: ""
  });

  const [cardErrors, setCardErrors] = useState({
    cardNumber: true,
    cardMonth: true,
    cardSecurityCode: true,
    cardYear: true
  });

  const warrantyPrice: string = useMemo(() => {
    return (
      (Number(selectedOffer.warrantyPrice) - Number(selectedOffer.price)) *
      Number(selectedOffer.maxOrderQty)
    ).toFixed(2);
  }, [selectedOffer]);

  const handleBillingChange = (
    key: keyof typeof billingData,
    value: string
  ) => {
    const errorsObj: any = {};

    if (key === "postalCode") {
      errorsObj[key] = !isPostalCodeValid(value);
    }

    const stringValidationKeys = ["address1", "city", "state"];

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
    const errorsObj: typeof errors = {
      ...errors
    };
    if (key === "emailAddress") {
      errorsObj[key] = !isEmailValid(value);
    }

    if (key === "shipPostalCode") {
      errorsObj[key] = !isPostalCodeValid(value);
    }

    const stringValidationKeys = [
      "shipFirstName",
      "shipLastName",
      "shipAddress1",
      "shipCity",
      "shipState",
      "shipCountry"
    ];

    if (stringValidationKeys.includes(key)) {
      const isFieldValid = !!value.trim();
      errorsObj[key as keyof typeof errorsObj] = !isFieldValid;
    }

    setErrors({
      ...errors,
      ...errorsObj
    });

    setData((prevData) => ({
      ...prevData,
      [key]: value
    }));
  };

  const handleCardInfo = (key: string, value: string): void => {
    const errorsObj: typeof cardErrors = {
      ...cardErrors
    };
    if (key === "cardNumber") {
      if (
        value
          .trim()
          .split("")
          .every((num: string) => Number(num) === 0)
      ) {
        if (value.length >= 13) {
          errorsObj[key as keyof typeof errorsObj] = false;
        } else {
          errorsObj[key as keyof typeof errorsObj] = true;
        }

        setCardInfo((prevData) => ({
          ...prevData,
          [key]: value
        }));

        setCardErrors({
          ...cardErrors,
          ...errorsObj
        });
        return;
      }

      errorsObj[key as keyof typeof errorsObj] = !isCardValid(value);

      if (value.length >= 4 && !isCardValid(value)) {
        showAlert({
          type: "error",
          title: "Only Visa, Mastercards, Discover and Amex are supported!",
          onOk: (instance) => {
            instance.clickConfirm();

            setCardErrors({
              ...cardErrors,
              [key as keyof typeof cardErrors]: true
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
      errorsObj[key as keyof typeof errorsObj] = !isCvvValid(value);
    }

    if (key === "cardYear") {
      const isFieldValid = !!value;
      errorsObj[key as keyof typeof errorsObj] = !isFieldValid;

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

    setCardErrors({
      ...cardErrors,
      ...errorsObj
    });

    setCardInfo((prevData) => ({
      ...prevData,
      [key]: value
    }));
  };

  const handleActivateCoupon = () => {
    setIsCouponActivated(true);
  };

  useEffect(() => {
    if (isCouponActivated) {
      setData((prevData) => ({
        ...prevData,
        couponCode: "SAVE15WTY3"
      }));
    }
  }, [isCouponActivated]);

  useEffect(() => {
    (async () => {
      const {
        message: { data }
      } = await fetchProducts({ campaignId: productType.productCampaignId });

      const selectedCountries = extractCountries(
        data,
        productType.productCampaignId
      );

      setCountries(selectedCountries);

      if (selectedCountries.length === 1) {
        setData((prevData) => ({
          ...prevData,
          shipCountry: selectedCountries[0]["id"]
        }));
        setErrors((prevErrors) => ({ ...prevErrors, shipCountry: false }));
      }

      const selectedStates = extractStates(selectedCountries);

      setStates(selectedStates);

      const products = data[productType.productCampaignId]["products"];

      const activeOffersIds = productType.activeOfferIds;
      const warrantyOffersIds = productType.warrantyOfferIds;

      const offers = products.filter(({ productType }: any) => {
        return productType === "OFFER";
      });

      const offersWithOutWarranty = offers.filter(
        ({ campaignProductId }: any) => {
          return activeOffersIds.includes(campaignProductId);
        }
      );

      const offersWithWarranty: any = {};

      offers.forEach(({ campaignProductId, ...rest }: any) => {
        if (warrantyOffersIds.includes(campaignProductId)) {
          offersWithWarranty[campaignProductId] = {
            ...rest,
            campaignProductId
          };
        }
      });

      const finalOffers = offersWithOutWarranty.map((product: any) => {
        const singleProduct =
          type === SW_OFFER
            ? STOPWATT_PRICINGS[
                product.campaignProductId as keyof typeof STOPWATT_PRICINGS
              ]
            : ESAVER_PRICINGS[
                product.campaignProductId as keyof typeof ESAVER_PRICINGS
              ];

        const singleWarrantyProduct =
          offersWithWarranty[singleProduct.warrantyProductId];

        return {
          ...product,
          ...singleProduct,
          oldPrice: (
            product.price *
            product.maxOrderQty *
            (100 / SW_COUPON_DISCOUNT)
          ).toFixed(2),
          newPrice: (product.price * product.maxOrderQty).toFixed(2),
          discount: SW_COUPON_DISCOUNT,
          warrantyPrice: singleWarrantyProduct.price,
          warrantyProductId: singleWarrantyProduct.campaignProductId
        };
      });

      setActiveOffers(finalOffers);
    })();
  }, [productType, type]);

  const scrollToPricing = (): void => {
    if (!pricingRef.current) return;

    pricingRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPayment = (): void => {
    if (!paymentRef.current) return;

    paymentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPaySource = (): void => {
    if (!paySourceRef.current) return;

    paySourceRef.current.scrollIntoView();
  };

  const goToNextForm = (): void => {
    setIsBlurred(true);

    const isAnyError: boolean = Object.keys(errors).some(
      (errorKey) => errors[errorKey as keyof typeof errors]
    );

    if (isAnyError) {
      showAlert({
        type: "error",
        title: "Please enter/correct the following required fields"
        // text: isAnyError.join(" ,  ")
      });
      return;
    }

    setShowCardForm(true);
  };

  const saveOrderDetails = useCallback(async () => {
    const sessionId = localStorage.getItem("sessionId");

    const details: any = {
      ...data,
      call_type: "leads_import",
      campaignId: productType.productCampaignId,
      sessionId
    };

    await leadsImport(details);
  }, [data, productType]);

  const completeOrder = useCallback(async () => {
    const mergedErros = { ...errors, ...cardErrors };

    const errorsArr: string[] = Object.keys(mergedErros)
      .filter((key) => mergedErros[key as keyof typeof mergedErros])
      .map((key) => key);

    if (errorsArr.length > 0) {
      showAlert({
        type: "error",
        title: "Please enter/correct the following required fields",
        text: errorsArr.join(" ,  ")
      });

      return;
    }

    const sessionId = localStorage.getItem("sessionId");

    const details: any = {
      call_type: "order_import",
      campaignId: productType.productCampaignId,
      sessionId,
      ...(data.billShipSame === 0 ? { ...billingData } : {}),
      ...data,
      ...cardInfo,
      product1_id: isWarrantyApplied
        ? selectedOffer.warrantyProductId
        : selectedOffer.campaignProductId,
      product1_price: isWarrantyApplied
        ? selectedOffer.warrantyPrice
        : selectedOffer.price,
      product1_qty: selectedOffer.maxOrderQty,
      product1_shipPrice: selectedOffer.shippingPrice,
      billerId: selectedOffer.billerId,
      paySource: "CREDITCARD"
    };

    const { message, result } = await orderImport(details);

    if (result === "SUCCESS" && message?.orderId) {
      router.push(`/offers/${type}/upsell?orderId=${message.orderId}`);
    }

    if (result === "ERROR") {
      showAlert({
        type: "error",
        title: message
      });
    }
  }, [
    router,
    isWarrantyApplied,
    selectedOffer,
    data,
    cardInfo,
    errors,
    cardErrors,
    showAlert,
    type,
    productType
  ]);

  const redirectToPaypal = async () => {
    const couponApplied = localStorage.getItem("coupon_code");
    const sessionId = localStorage.getItem("sessionId");

    const details: any = {
      paySource: "PAYPAL",
      paypalBillerId: isTestmode ? 9 : 8,
      salesUrl: window.location.href,
      errorRedirectsTo: window.location.href,
      call_type: "order_import",
      campaignId: productType.productCampaignId,
      sessionId,
      product1_id: isWarrantyApplied
        ? selectedOffer.warrantyProductId
        : selectedOffer.campaignProductId,
      product1_price: isWarrantyApplied
        ? selectedOffer.warrantyPrice
        : selectedOffer.price,
      product1_qty: selectedOffer.maxOrderQty,
      product1_shipPrice: selectedOffer.shippingPrice,
      billerId: selectedOffer.billerId
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
    const couponApplied = localStorage.getItem("coupon_code");
    const sessionId = localStorage.getItem("sessionId");
    const product = JSON.parse(localStorage.getItem("selected_Offer") ?? "");

    setIsLoading(true);
    const details: any = {
      call_type: "transactions_confirmPaypal",
      sessionId,
      paySource: "PAYPAL",
      paypalBillerId: isTestmode ? 9 : 8,
      paypalAccept: paypalAccept,
      token: token,
      payerId: PayerID,
      salesUrl: window.location.href,
      errorRedirectsTo: window.location.href,
      campaignId: productType.productCampaignId,
      product1_id: isWarrantyApplied
        ? product.warrantyProductId
        : product.campaignProductId,
      product1_price: isWarrantyApplied ? product.warrantyPrice : product.price,
      product1_qty: product.maxOrderQty,
      product1_shipPrice: product.shippingPrice,
      billerId: product.billerId
    };

    if (couponApplied) {
      details.couponCode = couponApplied;
    }

    const { message, result } = await transactionsConfirmPaypal(details);

    if (result === "SUCCESS") {
      setIsLoading(false);
      router.push(
        `/offers/${type}/upsell?orderId=${
          message.orderId
        }&paypalAccept=${paypalAccept}&PayerID=${PayerID}&token=${token}${
          isTestmode ? `&testmode=${isTestmode}` : ""
        }`
      );
    }
    if (result === "ERROR") {
      setIsLoading(false);
      router.push(`/offers/${type}`);

      showAlert({
        type: "error",
        title: message
      });
    }
  }, [
    PayerID,
    isTestmode,
    isWarrantyApplied,
    paypalAccept,
    productType,
    router,
    token,
    type,
    showAlert
  ]);

  useEffect(() => {
    if (paypalAccept && token && PayerID) {
      onPaypalSuccessPurchased();
    }
  }, [paypalAccept, token, PayerID, onPaypalSuccessPurchased]);

  useEffect(() => {
    if (Object.keys(selectedOffer).length === 0) return;
    scrollToPayment();
  }, [selectedOffer]);

  useEffect(() => {
    if (!isPaySourceSelected) return;
    scrollToPaySource();
  }, [isPaySourceSelected]);

  // footer links
  const footerLInk = [
    { text: "Terms and Conditions", links: "/terms-conditions" },
    { text: "Privacy Policy", links: "/privacy-policy" },
    { text: "Contact Us", links: "/contact-us" }
  ];

  return (
    <div className="w-full">
      {isLoading && <ProgressLoader />}
      <ConfigSession />
      <NotifyPopup productName={productType.productName} />
      <OfferCoupon
        onActivateCoupon={handleActivateCoupon}
        isCouponActivated={isCouponActivated}
      />
      {/* HEADER */}
      <OfferHeader />

      {/* SUB HEADER */}
      <div className="border-b border-b-shape-grey">
        <Container extraClasses="!pt-3 !pb-5 max-lg:!py-3">
          <div className="flex max-md:justify-center justify-between items-center max-md:gap-3">
            <Image
              src={productType.productLogo}
              className="w-48 object-contain"
              alt="offer"
            />
            <Image
              src={Rating}
              className="w-28 object-contain md:hidden"
              alt="rating"
            />
            <div className="flex gap-5 max-lg:hidden">
              <Image
                src={Rating}
                className="w-32 object-contain"
                alt="rating"
              />
              <Image
                src={CreditCards}
                className="w-[250px] object-contain select-none"
                alt="credit-cards"
              />
              <Button
                text="CHOOSE YOURS & START SAVING NOW"
                variant="gradient"
                endIcon={<PiCaretDoubleRightFill size={22} />}
                onClick={scrollToPricing}
                name="choose-offer"
              />
            </div>
          </div>
        </Container>
      </div>
      {/* BANNER */}
      <div className="w-full max-sm:bg-stopwatt-banner-mobile lg:bg-stopwatt-banner bg-no-repeat bg-cover bg-right-top py-5 relative">
        <Container>
          <Image
            src={productType.productImg}
            alt="product offer"
            className="w-[320px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 max-lg:hidden"
          />
          <Image
            src={productType.productMobileImg}
            alt="product offer"
            className="w-[180px] opacity-50 sm:w-[270px] absolute top-32 right-0 z-10 lg:hidden"
          />
          <Typography
            text="STOP WASTING MONEY"
            variant="main-heading"
            extraClasses="!text-xl !text-pink-700 sm:!text-pink-700 mb-2"
          />
          <Typography
            text="ON DIRTY, UNSTABLE ELECTRICITY"
            variant="heading"
            extraClasses="!text-lg !text-gray-700 !font-bold mb-6"
          />
          <ul className="mb-3 ">
            {[
              "Stabilize Electrical Current",
              "Reduce Dirty Electricity",
              "Protect Appliances & Electronics"
            ].map((point: string, index: number) => {
              return (
                <li
                  key={`point-${index + 1}`}
                  className="bg-thunder-bullet bg-no-repeat pl-10 pb-5 thunder-bullet"
                >
                  <Typography
                    variant="text"
                    text={point}
                    extraClasses="sm:!text-xl !text-base"
                  />
                </li>
              );
            })}
          </ul>
          <Button
            text={`GET UP TO 65% OFF ${productType.productName} EXPIRES AT MIDNIGHT`}
            variant="gradient"
            extraClasses="w-full max-w-[300px] max-sm:max-w-full"
            onClick={scrollToPricing}
            name="choose-offer"
          />
          <Typography
            variant="text"
            text="Choose Yours And Start Saving Now"
            extraClasses="max-sm:bg-white/70 !text-black !font-bold text-center mt-3 max-sm:pt-3 md:hidden"
          />
          <GuranteeBadge extraClasses="max-md:hidden" />
          <div className="max-w-[550px] flex items-center gap-5 py-5 max-md:hidden">
            <Image className="w-20" src={Brenda} alt="feedback" />
            <div className="flex-1">
              <p className="text-base mb-2.5 leading-5">
                &quot;If you’re skeptical, I feel sorry for you.{" "}
                <span className="text-green-600 font-bold">
                  {productType.productName} has really made something special
                  here.
                </span>{" "}
                I&apos;m not entirely sure how it works, but the savings are
                REAL!&quot;
              </p>
              <div className="flex items-center gap-6">
                <Typography
                  variant="text"
                  text="Brenda Shearer, Syracuse, NY"
                  extraClasses="!text-neutral-400 !font-light"
                />
                <Image className="w-20" src={Rating5Stars} alt="rating" />
              </div>
            </div>
          </div>
          <div className="max-w-[800px] max-md:max-w-full flex max-lg:flex-col max-md:flex-row max-md:justify-between max-sm:bg-white/70 lg:border-t border-stone-300 pt-5">
            <div className="p-5 max-lg:p-1.5">
              <Image className="w-20" src={Warranty} alt="90 days warranty" />
            </div>
            <div className="flex-1 p-5 max-lg:p-1.5 lg:border-l max-lg:max-w-[310px] max-md:max-w-[70%] border-stone-300">
              <Typography
                variant="text"
                text="No-Hassle Returns"
                extraClasses="!text-gray-700 !font-bold mb-3"
              />
              <Typography
                variant="text"
                text={`If you are not satisfied with your ${productType.productName}, you can return it within 60 days of delivery for a full refund.`}
                extraClasses="!text-gray-700 !font-light leading-4"
              />
            </div>
            <div className="flex-1 p-5 max-lg:p-1.5 lg:border-l max-lg:max-w-[310px] border-stone-300 max-md:hidden">
              <Typography
                variant="text"
                text="Quick & Convenient"
                extraClasses="!text-gray-700 !font-bold mb-3"
              />
              <Typography
                variant="text"
                text={`Get ${productType.productName} delivered to your home. It’s simple to use and sets up in minutes!`}
                extraClasses="!text-gray-700 !font-light"
              />
            </div>
          </div>
        </Container>
      </div>
      {/* FEATURED LOGOS */}
      <div className="bg-gray-700 py-8">
        <Container>
          <Image
            className="w-[90%] mx-auto max-sm:hidden"
            src={FeaturedLogos}
            alt="featured logos"
          />
          <Image
            className="w-[300px] mx-auto sm:hidden"
            src={FeaturedLogosMobile}
            alt="featured logos"
          />
        </Container>
      </div>
      {/* PRODUCT OVERVIEW */}
      <div className="py-12">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:max-w-[80%] mx-auto gap-8">
            <Image
              className="w-full"
              src={StopwattDisplay}
              alt="product display"
            />
            <div className="flex flex-col gap-3">
              <Typography
                text={`Meet ${productType.productName}`}
                variant="text"
                extraClasses="!text-lime-600 !text-xl !font-light"
              />
              <Typography
                text="Stabilize Your Current, Remove Dirty Electricity, Slash Your Power Bill Today!"
                variant="heading"
                extraClasses=" text-2xl !text-gray-700 sm:!text-gray-700 sm:!text-4xl !font-bold"
              />
              <Typography
                text={`${productType.productName} patent-pending technology provides your home with a smooth, stable electrical current that leads to an increase in efficiency, reduction in dirty electricity, less waste power, and dramatically lower energy consumption.`}
                variant="text"
                extraClasses="!text-slate-500 !font-light !text-base"
              />
              <Button
                variant="gradient"
                text={`GET UP TO 65% OFF ${productType.productName} EXPIRES AT MIDNIGHT`}
                extraClasses="my-5 max-w-[300px] mx-auto"
                onClick={scrollToPricing}
                name="choose-offer"
              />
              <GuranteeBadge extraClasses="!max-w-[450px]" />
            </div>
          </div>
        </Container>
      </div>
      {/* PRODUCT BENEFITS */}
      <div
        className={`${productType.bgBox} bg-no-repeat bg-center bg-zinc-100 py-12`}
      >
        <Container>
          <Typography
            variant="text"
            text="Whole-Home Electricity Stabilization"
            extraClasses="text-lg !text-lime-600 sm:!text-xl !font-light text-center mb-3"
          />
          <Typography
            variant="heading"
            text={`Benefits of ${productType.productName}`}
            extraClasses="text-2xl !text-gray-700 sm:!text-4xl !font-bold text-center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3  my-12">
            <div className="flex flex-col gap-0 sm:gap-16 items-end mx-auto  ">
              {STARTING_BENEFITS.map(
                ({ text, imageUrl, isActive, isInverse }) => {
                  return (
                    <TextBox
                      key={text}
                      imageSource={imageUrl}
                      text={text}
                      isActive={isActive}
                      isInvert={isInverse}
                    />
                  );
                }
              )}
            </div>
            <div />
            <div className="flex flex-col gap-0 sm:gap-16 mx-auto">
              {ENDING_BENEFITS.map(
                ({ text, imageUrl, isActive, isInverse }) => {
                  return (
                    <TextBox
                      key={text}
                      imageSource={imageUrl}
                      text={text}
                      isActive={isActive}
                      isInvert={isInverse}
                    />
                  );
                }
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-5">
            <Button
              variant="gradient"
              text={`GET UP TO 65% OFF ${productType.productName} EXPIRES AT MIDNIGHT`}
              extraClasses="max-w-[300px]"
              onClick={scrollToPricing}
              name="choose-offer"
            />
            <GuranteeBadge extraClasses="!max-w-[450px]" />
          </div>
        </Container>
      </div>
      {/* PRODUCT USAGE */}
      <div className="py-12">
        <Container>
          <Typography
            variant="heading"
            text="How It Works"
            extraClasses="text-3xl !text-gray-700  sm:!text-gray-700 sm:!text-4xl !font-bold text-center"
          />
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 max-w-[95%] mx-auto mt-12 sm:gap-12">
            <VidepPlayer
              source="/assets/videos/stopwatt-vid.mp4"
              width="100%"
              height={200}
              loop
              muted={false}
              playsInline
              controls
            />
            <div className="col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-3">
                {STOPWATT_USAGE.map(
                  ({ title, description, imageUrl }, index, arr) => {
                    return (
                      <div
                        key={title}
                        className={`flex flex-col items-center pt-3.5 sm:px-5 gap-5 ${
                          Math.floor(arr.length / 2) === index
                            ? "border-l border-r border-stone-500 border-dashed"
                            : ""
                        }`}
                      >
                        <Image
                          src={imageUrl}
                          alt="product usage"
                          className="w-14 h-14 object-contain"
                        />
                        <Typography
                          text={title}
                          variant="heading"
                          extraClasses="!text-gray-700 !text-xl !font-bold text-center"
                        />
                        <Typography
                          text={
                            productType.productName === "STOPWATT"
                              ? description.replaceAll(
                                  "ESaver Watt",
                                  "StopWatt"
                                )
                              : productType.productName === "ESAVER WATT"
                                ? description.replaceAll(
                                    "StopWatt",
                                    "ESaver Watt"
                                  )
                                : ""
                          }
                          variant="text"
                          extraClasses="!text-gray-700 !text-base !font-light text-center"
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
          <div className="w-full max-w-[300px] mx-auto my-8">
            <Button
              variant="gradient"
              text={`GET UP TO 65% OFF ${productType.productName} EXPIRES AT MIDNIGHT`}
              onClick={scrollToPricing}
              name="choose-offer"
            />
          </div>
          <GuranteeBadge extraClasses="!max-w-[450px] mx-auto py-0" />
        </Container>
      </div>
      {/* PRODUCT STEPS */}
      <div className="bg-stone-50 py-12">
        <Container>
          <Typography
            variant="text"
            text="GET STARTED IN 3 EASY STEPS"
            extraClasses="!text-lime-600 !text-xl !font-light text-center mb-3"
          />
          <Typography
            variant="heading"
            text={`Using ${productType.productName} is Quick/Simple and Easy`}
            extraClasses=" !text-lg !text-gray-700  sm:!text-gray-700 sm:!text-4xl !font-bold text-center mb-1.5"
          />
          <Typography
            variant="text"
            text="Stabilizing Your Electricity is as Simple As 1 2 3…"
            extraClasses="pt-2 !text-slate-500 !text-base !font-light text-center"
          />
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-12 sm:pt-12 !pt-4">
            {STOPWATT_STEPS.map(({ title, description, imageUrl }) => {
              return (
                <div key={title} className="flex flex-col items-center">
                  <Image className="w-64" src={imageUrl} alt="product step" />
                  <Typography
                    text={title}
                    variant="heading"
                    extraClasses="!text-gray-700 !text-xl text-center !font-bold mt-8 mb-5 max-w-[230px]"
                  />
                  <Typography
                    text={description}
                    variant="text"
                    extraClasses="!text-base !font-light text-center"
                  />
                </div>
              );
            })}
          </div>
          <div className="w-full max-w-[300px] mx-auto my-8">
            <Button
              variant="gradient"
              text={`GET UP TO 65% OFF ${productType.productName} EXPIRES AT MIDNIGHT`}
              onClick={scrollToPricing}
              name="choose-offer"
            />
          </div>
          <GuranteeBadge extraClasses="!max-w-[450px] mx-auto py-0" />
        </Container>
      </div>
      {/* PRODUCT REVIEWS */}
      <div className="bg-review-banner bg-top bg-cover bg-no-repeat bg-white py-12">
        <Container>
          <div className="max-w-[750px] mx-auto mb-1.5">
            <Typography
              variant="heading"
              text="Customer Reviews"
              extraClasses="!text-lime-600 !text-xl !font-light text-center mb-1.5"
            />
            <Typography
              variant="heading"
              text={`Read what our customers have to say about ${productType.productName}`}
              extraClasses="!text-lg !text-gray-700 sm:!text-gray-700 sm:!text-4xl !font-bold text-center"
            />
          </div>
          <div className="grid grid-cols-2 mt-8 max-md:hidden">
            {productType.productReviews.map(
              (
                { text, clientName, imageUrl, rating, title, userImageUrl },
                index
              ) => {
                return (
                  <div
                    key={`review-${index + 1}`}
                    className="w-full px-5 py-10 flex items-start gap-5 bg-white/80 border border-black/10"
                  >
                    <Image
                      className="w-20 h-20 object-contain"
                      src={userImageUrl}
                      alt="review user"
                    />
                    <div className="flex-1">
                      <Typography
                        variant="text"
                        text={title}
                        extraClasses="!text-gray-700 !text-lg !font-semibold !leading-5 mb-3"
                      />
                      <div
                        className="text-gray-700 text-base font-normal max-md:text-base leading-5 mb-5"
                        dangerouslySetInnerHTML={{ __html: text }}
                      />
                      <Typography
                        variant="text"
                        text={clientName}
                        extraClasses="!text-slate-500 !font-normal mb-3"
                      />
                      <div className="flex items-center gap-5">
                        <Image className="w-20" src={imageUrl} alt="rating" />
                        <Typography
                          variant="text-small"
                          text={rating}
                          extraClasses="!text-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </Container>
      </div>
      {/* PRODUCT PRICING */}
      <div className="bg-stone-50 pt-5 pb-10" ref={pricingRef}>
        <Container>
          <Typography
            text={`Why ${productType.productName}?`}
            variant="heading"
            extraClasses="text-2xl !text-gray-700 sm:!text-3xl !font-bold text-center mb-3"
          />
          <Typography
            text="Rated an average of 4.7 out of 5"
            variant="text"
            extraClasses="!text-lime-600 !text-xl !font-light text-center mb-8"
          />
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-4">
            {PRODUCT_FEATURES.map(({ text, imageUrl }) => {
              return (
                <div key={text} className="flex flex-col items-center gap-3">
                  <Image
                    src={imageUrl}
                    alt="product information"
                    className="w-24"
                  />
                  <Typography
                    variant="text"
                    text={text}
                    extraClasses="!text-green-700 !text-lg text-center"
                  />
                </div>
              );
            })}
          </div>
          <Typography
            text={`How Many ${productType.productName} Do I Need?`}
            variant="heading"
            extraClasses="text-2xl !text-gray-700 sm:!text-4xl !font-bold !text-center mt-8 mb-3"
          />
          <Typography
            text="Please Choose Your House/Apartment Size"
            variant="text"
            extraClasses="!text-slate-500 !font-normal !text-center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
            {activeOffers.map((product: any, index: number) => {
              return (
                <PricingCard
                  isCouponActivated={isCouponActivated}
                  key={`pricing-${index + 1}`}
                  type={type}
                  product={product}
                  isActive={
                    selectedOffer?.campaignProductId ===
                      product.campaignProductId ||
                    (!selectedOffer?.campaignProductId && index === 1)
                  }
                  onSelect={(product: any) => {
                    if (
                      Object.keys(selectedOffer).length > 0 &&
                      selectedOffer.campaignProductId ===
                        product.campaignProductId
                    ) {
                      scrollToPayment();
                      return;
                    }

                    setSelectedOffer(product);
                    localStorage.setItem(
                      "selected_Offer",
                      JSON.stringify(product)
                    );
                  }}
                />
              );
            })}
          </div>
        </Container>
      </div>
      {/* PRODUCT CHECKOUT */}
      {Object.keys(selectedOffer).length > 0 && (
        <div className="border border-t-neutral-200 py-12" ref={paymentRef}>
          <Container>
            <div className="bg-gradient-to-r from-[#eeba4c] to-[#eeba4c] border border-neutral-200 shadow-lg p-5 rounded-md mb-5">
              <div className="bg-white border-2 border-dashed border-red-600">
                <div className="bg-[#E5F97680] flex justify-center items-center gap-1 py-2">
                  <FaArrowRight className="text-red-500 animate-bounce-left" />
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={isWarrantyApplied}
                      onChange={() => setIsWarrantyApplied(!isWarrantyApplied)}
                    />
                    <Typography
                      variant="text"
                      text="YES, I Want Extended Warranty"
                      extraClasses="!text-xs !text-base !font-bold"
                    />
                  </div>
                  <FaArrowLeft className="text-red-500 animate-bounce-right" />
                </div>
                <div className="p-4">
                  <p className="!text-xs text-gray-700 sm:!text-sm">
                    <span className="font-bold">One Time Offer: </span> By
                    placing your order today, you can have an extended warranty
                    and replacement plan for only an additional{" "}
                    <span className="font-bold">${warrantyPrice}.</span> This
                    means your product is covered for 3 Years.
                  </p>
                </div>
              </div>
            </div>
            <Typography
              variant="heading"
              text="Select Your Payment Method"
              extraClasses="text-center !text-xl sm:!text-4xl mb-7"
            />
            <button
              className="bg-amber-400 w-full rounded-md flex justify-center items-center px-6 py-4"
              onClick={redirectToPaypal}
            >
              <Image
                src={Paypal}
                alt="paypal payment"
                className=" !w-16 !sm:w-24 object-contain"
              />
            </button>
            <div className="my-6 relative flex justify-center items-center">
              <div className="w-full h-[1px] bg-zinc-300 absolute top-1/2 left-0" />
              <Typography
                text="OR"
                variant="text"
                extraClasses="!text-base !font-normal px-3 bg-white"
              />
            </div>
            <button
              className="bg-green-600 w-full rounded-md flex justify-center items-center px-6 py-4 text-white mb-4"
              onClick={() => {
                if (isPaySourceSelected) {
                  scrollToPaySource();
                  return;
                }

                setIsPaySourceSelected(true);
              }}
              name="payment-button"
            >
              Pay With Credit or Debit Card
            </button>
            <div className="flex justify-center items-center mb-5 gap-1.5">
              {[Card1, Card2, Card3, Card4, Card5].map((image, index) => {
                return (
                  <Image
                    key={`card-${index + 1}-image`}
                    src={image}
                    className="w-12 object-contain"
                    alt="payment card"
                  />
                );
              })}
            </div>
            {isPaySourceSelected && (
              <>
                <div
                  className="flex items-center gap-3 mb-5"
                  ref={paySourceRef}
                >
                  <Image src={Shipping} alt="shipping icon" />
                  <Typography
                    text="Shipping Information"
                    variant="heading"
                    extraClasses="!text-gray-700 !text-2xl sm:!text-3xl !font-normal"
                  />
                </div>
                <div className="grid gap-3">
                  <TextInput
                    type="email"
                    name="email"
                    variant="outline"
                    placeholder="Preferred Email Address"
                    extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                    onChange={(e) => {
                      handleChange("emailAddress", e.target.value);
                    }}
                    onBlur={saveOrderDetails}
                    isError={isBlurred && errors.emailAddress}
                  />
                  <TextInput
                    variant="outline"
                    name="firtName"
                    placeholder="First Name"
                    extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                    onChange={(e) => {
                      handleChange("shipFirstName", e.target.value);
                    }}
                    onBlur={saveOrderDetails}
                    isError={isBlurred && errors.shipFirstName}
                  />
                  <TextInput
                    variant="outline"
                    name="lastName"
                    placeholder="Last Name"
                    extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                    onChange={(e) => {
                      handleChange("shipLastName", e.target.value);
                    }}
                    onBlur={saveOrderDetails}
                    isError={isBlurred && errors.shipLastName}
                  />
                  <TextInput
                    variant="outline"
                    name="address1"
                    placeholder="Address 1"
                    extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                    onChange={(e) => {
                      handleChange("shipAddress1", e.target.value);
                    }}
                    onBlur={saveOrderDetails}
                    isError={isBlurred && errors.shipAddress1}
                  />
                  <TextInput
                    variant="outline"
                    name="address2"
                    placeholder="Address 2"
                    extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                    onChange={(e) => {
                      handleChange("shipAddress2", e.target.value);
                    }}
                    onBlur={saveOrderDetails}
                  />
                  <TextInput
                    variant="outline"
                    name="city"
                    placeholder="City"
                    extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                    onChange={(e) => {
                      handleChange("shipCity", e.target.value);
                    }}
                    onBlur={saveOrderDetails}
                    isError={isBlurred && errors.shipCity}
                  />
                  <Select
                    variant="outline"
                    name="countries"
                    options={[
                      { id: "", label: "--Select a country --" },
                      ...countries
                    ]}
                    extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                    onChange={(e) => {
                      handleChange("shipCountry", e.target.value);
                    }}
                    onBlur={saveOrderDetails}
                    isError={isBlurred && errors.shipCountry}
                    value={data.shipCountry}
                  />
                  <Select
                    variant="outline"
                    name="state"
                    options={[
                      { id: "", label: "--Select State or Province --" },
                      ...states
                    ]}
                    extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                    onChange={(e) => {
                      handleChange("shipState", e.target.value);
                    }}
                    onBlur={saveOrderDetails}
                    isError={isBlurred && errors.shipState}
                    value={data.shipState}
                  />
                  <TextInput
                    variant="outline"
                    name="zipCode"
                    placeholder="Zip Code"
                    extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    minLength={5}
                    maxLength={5}
                    onChange={(e) => {
                      handleChange("shipPostalCode", e.target.value);
                    }}
                    onBlur={saveOrderDetails}
                    isError={isBlurred && errors.shipPostalCode}
                  />
                  <IntlTelInput
                    inputClassName={`w-full border border-zinc-400 py-4 rounded-md outline-none ${
                      isBlurred && errors.phoneNumber
                        ? "!bg-red-100 !text-red-700"
                        : ""
                    }`}
                    placeholder="Mobile Phone"
                    separateDialCode
                    onPhoneNumberChange={(
                      isValid,
                      // value,
                      // selectedCountryData,
                      fullNumber
                    ) => {
                      handleChange("phoneNumber", fullNumber);
                      setErrors({ ...errors, phoneNumber: !isValid });
                    }}
                    onPhoneNumberBlur={saveOrderDetails}
                  />
                  <button
                    className="w-full bg-green-600 border-2 border-green-900 text-2xl md:text-3xl text-white font-bold p-2 md:p-5"
                    onClick={goToNextForm}
                    name="next-button"
                  >
                    NEXT
                  </button>
                </div>
                {showCardForm && (
                  <>
                    <div className="border-t-2 border-zinc-500 mt-12 pt-12">
                      <div className="flex items-center gap-3 mb-5">
                        <Image src={Shipping} alt="shipping icon" />
                        <Typography
                          text="Your Shipping Method"
                          variant="heading"
                          extraClasses="!text-gray-700 text-2xl sm:!text-3xl !font-normal"
                        />
                      </div>
                      <div className="border-2 border-neutral-200 px-7 py-5 rounded-md">
                        <Typography
                          text="Shipping : UPS Ground (Estimate 3-5 Business Days)"
                          variant="text"
                          extraClasses="!text-gray-700 !text-lg !font-normal"
                        />
                      </div>
                    </div>
                    <div className="border-t-2 border-zinc-500 mt-12 pt-12">
                      <div className="flex items-start gap-3 mb-5">
                        <Image src={Shipping} alt="shipping icon" />
                        <div>
                          <Typography
                            text="Payment Information"
                            variant="heading"
                            extraClasses="!text-gray-700 text-2xl sm:!text-3xl !font-normal"
                          />
                          <Typography
                            text="All transactions are secured and encrypted"
                            variant="heading"
                            extraClasses="!text-zinc-500 !text-lg !font-normal"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-1.5">
                        <input
                          type="checkbox"
                          name="billShipSame"
                          checked={!!data.billShipSame}
                          onChange={() => {
                            if (data.billShipSame === 1) {
                              setData((prevData: typeof data) => {
                                return {
                                  ...prevData,
                                  billShipSame: 0
                                };
                              });

                              return;
                            }

                            setData((prevData: typeof data) => {
                              return {
                                ...prevData,
                                billShipSame: 1
                              };
                            });
                          }}
                        />
                        <Typography
                          text=" Billing Same as Shipping Address"
                          variant="text"
                          extraClasses="!text-gray-700 !text-base !font-bold text-center"
                        />
                      </div>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          !Number(data.billShipSame)
                            ? "max-h-[500px]"
                            : "max-h-0"
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
                          extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4 my-2"
                          name="firstName"
                          value={billingData.firstName}
                          onChange={(e) => {
                            handleBillingChange("firstName", e.target.value);
                          }}
                          onBlur={saveOrderDetails}
                          isValid={isBlurred && !billingErrors.firstName}
                          isError={isBlurred && billingErrors.firstName}
                        />
                        <TextInput
                          variant="outline"
                          placeholder="Last Name"
                          extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4 my-2"
                          name="lastName"
                          value={billingData.lastName}
                          onChange={(e) => {
                            handleBillingChange("lastName", e.target.value);
                          }}
                          onBlur={saveOrderDetails}
                          isValid={isBlurred && !billingErrors.lastName}
                          isError={isBlurred && billingErrors.lastName}
                        />
                        <TextInput
                          variant="outline"
                          placeholder="Address 1"
                          extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4 my-2"
                          name="address1"
                          onChange={(e) => {
                            handleBillingChange("address1", e.target.value);
                          }}
                          onBlur={saveOrderDetails}
                          isValid={isBlurred && !billingErrors.address1}
                          isError={isBlurred && billingErrors.address1}
                        />
                        <TextInput
                          variant="outline"
                          placeholder="Address 2"
                          extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4 my-2"
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
                          options={[
                            { id: "", label: "-- Select --" },
                            ...states
                          ]}
                          extraClasses="!border-neutral-200 border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4 my-2"
                          name="state"
                          onChange={(e) => {
                            handleBillingChange("state", e.target.value);
                          }}
                          onBlur={saveOrderDetails}
                          isValid={isBlurred && !billingErrors.state}
                          isError={isBlurred && billingErrors.state}
                        />
                        <TextInput
                          variant="outline"
                          placeholder="City"
                          extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4 my-2"
                          name="city"
                          onChange={(e) => {
                            handleBillingChange("city", e.target.value);
                          }}
                          onBlur={saveOrderDetails}
                          isValid={isBlurred && !billingErrors.city}
                          isError={isBlurred && billingErrors.city}
                        />
                        <TextInput
                          variant="outline"
                          placeholder="Zip"
                          extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4 my-2"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          minLength={5}
                          maxLength={5}
                          name="postalCode"
                          onChange={(e) => {
                            handleBillingChange("postalCode", e.target.value);
                          }}
                          onBlur={saveOrderDetails}
                          isValid={isBlurred && !billingErrors.postalCode}
                          isError={isBlurred && billingErrors.postalCode}
                        />
                      </div>
                    </div>
                    <TextInput
                      variant="outline"
                      name="cardNumber"
                      placeholder="Card Number"
                      extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4 my-2"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={16}
                      onChange={(e) => {
                        handleCardInfo("cardNumber", e.target.value);
                      }}
                      value={cardInfo.cardNumber}
                      onBlur={() => setIsBlurred(true)}
                      isError={isBlurred && cardErrors.cardNumber}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Select
                        variant="outline"
                        name="cardYear"
                        options={[{ label: "YEAR", id: "" }, ...YEARS_ARRAY]}
                        extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                        onChange={(e) => {
                          handleCardInfo("cardYear", e.target.value);
                        }}
                        value={cardInfo.cardYear}
                        onBlur={() => setIsBlurred(true)}
                        isError={isBlurred && cardErrors.cardYear}
                      />
                      <Select
                        variant="outline"
                        name="cardMonth"
                        options={[{ label: "MONTH", id: "" }, ...MONTHS_ARRAY]}
                        extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                        onChange={(e) => {
                          handleCardInfo("cardMonth", e.target.value);
                        }}
                        onBlur={() => setIsBlurred(true)}
                        isError={isBlurred && cardErrors.cardMonth}
                      />
                      <TextInput
                        type="password"
                        name="password"
                        variant="outline"
                        placeholder="CVV"
                        extraClasses="border-zinc-400 !text-base placeholder:text-base rounded-md px-6 py-4"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={3}
                        onChange={(e) => {
                          handleCardInfo("cardSecurityCode", e.target.value);
                        }}
                        onBlur={() => setIsBlurred(true)}
                        isError={isBlurred && cardErrors.cardSecurityCode}
                      />
                    </div>
                    <button
                      className="w-full bg-green-600 border-2 border-green-900 text-2xl sm:text-3xl text-white font-bold p-2 md:p-5 my-8"
                      onClick={completeOrder}
                      name="completeOrder-button"
                    >
                      COMPLETE ORDER
                    </button>
                    <div className="bg-gray-200 p-5 mb-5">
                      <p>
                        By clicking above, I hereby affirm that I am at least 18
                        years of age and agree to the{" "}
                        <Link
                          href="/terms-conditions"
                          className="text-blue-700"
                        >
                          Terms & Conditions.
                        </Link>
                      </p>
                    </div>
                    <div className="bg-gray-200 p-5 mb-5">
                      <p>
                        Your personal data will be used to process your order,
                        support your experience throughout this website, and for
                        other purposes described in our{" "}
                        <Link href="/privacy-policy" className="text-blue-700">
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                    <div className="flex justify-center mb-8">
                      <Image src={Badge} alt="badge" />
                    </div>
                  </>
                )}
              </>
            )}
          </Container>
        </div>
      )}
      {/* SELECTED OFFER */}
      {Object.keys(selectedOffer).length > 0 && (
        <div className="bg-stone-50 border border-t-neutral-200">
          <Container>
            <div className="grid grid-cols-12 py-2">
              <div className="col-span-4 flex items-center justify-center">
                <div className="border border-neutral-200 bg-white rounded-md">
                  <Image
                    src={selectedOffer.imageUrl}
                    alt="selected offer"
                    className="w-24 object-contain"
                  />
                </div>
              </div>
              <div className="col-span-5 flex items-center">
                <Typography
                  text={selectedOffer.productName}
                  variant="text"
                  extraClasses="!text-gray-700 !text-base"
                />
              </div>
              <div className="col-span-3 flex items-center">
                <Typography
                  text={`$${
                    isCouponActivated
                      ? (
                          selectedOffer.newPrice -
                          selectedOffer.newPrice * 0.15
                        ).toFixed(2)
                      : selectedOffer.newPrice
                  }`}
                  variant="heading"
                  extraClasses="!text-gray-700 !font-bold"
                />
              </div>
            </div>
            <div className="border-y border-t-stone-300 border-dashed py-2.5 ">
              <div className="grid grid-cols-6 gap-y-3">
                <div className="col-span-5">
                  <Typography
                    variant="text"
                    text="Regular Price"
                    extraClasses="!text-xs	!text-gray-700 !font-normal"
                  />
                </div>
                <div className="col-span-1">
                  <Typography
                    variant="text"
                    text={`$${selectedOffer.oldPrice}`}
                    extraClasses="!text-gray-700 !font-normal text-right"
                  />
                </div>
                <div className="col-span-5">
                  <p className="!text-xs	!text-gray-700 sm:text-sm">
                    Coupon Applied:{" "}
                    <span className="font-bold">{`SAVE50 ${
                      isCouponActivated ? "+ 15% OFF" : ""
                    }`}</span>
                  </p>
                </div>
                <div className="col-span-1">
                  <Typography
                    variant="text"
                    text={`-$${
                      isCouponActivated
                        ? Number(
                            Number(selectedOffer.newPrice) * 0.15 +
                              Number(selectedOffer.newPrice)
                          ).toFixed(2)
                        : selectedOffer.newPrice
                    }`}
                    extraClasses="!text-gray-700 !font-normal text-right"
                  />
                </div>
                {isWarrantyApplied && (
                  <>
                    <div className="col-span-5">
                      <Typography
                        variant="text"
                        text={`${productType.productName} - 3-Years Extended Warranty`}
                        extraClasses="!text-xs	!text-gray-700 !font-normal"
                      />
                    </div>
                    <div className="col-span-1">
                      <Typography
                        variant="text"
                        text={`$${warrantyPrice}`}
                        extraClasses="!text-gray-700 !font-normal text-right"
                      />
                    </div>
                  </>
                )}
                <div className="col-span-5">
                  <Typography
                    variant="text"
                    text="Shipping Fee"
                    extraClasses="!text-xs	!text-gray-700 !font-normal"
                  />
                </div>
                <div className="col-span-1">
                  <Typography
                    variant="text"
                    text={`$${selectedOffer.shippingPrice}`}
                    extraClasses="!text-gray-700 !font-normal text-right"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-6 py-3">
              <div className="col-span-5">
                <Typography
                  text="Total:"
                  variant="text"
                  extraClasses="!text-sm !text-gray-700 sm:!text-lg !font-bold"
                />
              </div>
              <div className="col-span-1">
                <Typography
                  text={`$${(
                    Number(selectedOffer.newPrice) +
                    Number(selectedOffer.shippingPrice) +
                    (isWarrantyApplied ? Number(warrantyPrice) : 0)
                  ).toFixed(2)}`}
                  variant="text"
                  extraClasses="!text-gray-700 !text-lg !font-bold text-right"
                />
              </div>
            </div>
          </Container>
        </div>
      )}
      {/* UPPER FOOTER */}
      <div className="bg-gray-700">
        <Container>
          <div className="block sm:flex items-start gap-8 pt-8 pb-4">
            <Image
              src={MoneyBackGurantee}
              alt="gurantee badge"
              className="w-40 mx-auto sm:w-32"
            />
            <div className="flex-1 mt-4">
              <Typography
                text={`Try ${productType.productName} Risk-Free: 60-Day Money-Back Promise`}
                variant="heading"
                extraClasses="!text-lg !text-lime-500 sm:!text-2xl !font-bold mb-6"
              />
              <Typography
                text={`We’re backing your decision to save energy with ${productType.productName}. Give it a go for 60 days, and if you’re not seeing the difference, we’ll refund every penny. We’re here to power up your savings, not your stress!`}
                variant="text"
                extraClasses="!text-white !text-base !font-normal mb-3"
              />
              <Typography
                text="Got questions? We're here to help! Mail us at: support@smartesaver.com"
                variant="heading"
                extraClasses="!text-white !text-lg !font-bold mb-3"
              />
            </div>
          </div>
        </Container>
      </div>
      {/* PRODUCT QUESTIONS */}
      <div className="w-full bg-white">
        <Container>
          <div className="flex justify-center items-center gap-3 py-4 sm:py-8">
            <Typography
              text="Questions?"
              variant="heading"
              extraClasses="!text-lg !text-gray-700 sm:!text-4xl !font-bold mb-3"
            />
            <div
              onClick={() => setShowQuestion((prev) => !prev)}
              className="underline under cursor-pointer decoration-lime-600"
            >
              <Typography
                text="We’ve Got You Covered!"
                variant="heading"
                extraClasses="!text-sm !text-lime-600 sm:!text-4xl !font-bold mb-3"
              />
            </div>
          </div>

          {showQuestion && (
            <div>
              {QUESTIONS.map((item, ind) => (
                <Collapse
                  title={
                    productType.productName === "STOPWATT"
                      ? item.title.replaceAll("ESaver Watt", "StopWatt")
                      : productType.productName === "ESAVER WATT"
                        ? item.title.replaceAll("StopWatt", "ESaver Watt")
                        : ""
                  }
                  key={ind}
                >
                  <div
                    className=" text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html:
                        productType.productName === "STOPWATT"
                          ? item.description.replaceAll(
                              "ESaver Watt",
                              "StopWatt"
                            )
                          : productType.productName === "ESAVER WATT"
                            ? item.description.replaceAll(
                                "StopWatt",
                                "ESaver Watt"
                              )
                            : ""
                    }}
                  />
                </Collapse>
              ))}
              <Typography
                text="ORDERING/SHIPPING FAQs"
                variant="heading"
                extraClasses="!text-gray-700 !text-xl sm:!text-2xl !font-bold my-3 text-center"
              />
              {SHIPPING_FAQS.map((item, ind) => (
                <Collapse
                  title={
                    productType.productName === "STOPWATT"
                      ? item.title.replaceAll("ESaver Watt", "StopWatt")
                      : productType.productName === "ESAVER WATT"
                        ? item.title.replaceAll("StopWatt", "ESaver Watt")
                        : ""
                  }
                  key={ind}
                >
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html:
                        productType.productName === "STOPWATT"
                          ? item.description.replaceAll(
                              "ESaver Watt",
                              "StopWatt"
                            )
                          : productType.productName === "ESAVER WATT"
                            ? item.description.replaceAll(
                                "StopWatt",
                                "ESaver Watt"
                              )
                            : ""
                    }}
                  />
                </Collapse>
              ))}
              <Typography
                text="REFUND/RETURN FAQs"
                variant="heading"
                extraClasses="!text-gray-700 !text-xl sm:!text-2xl !font-bold my-3 text-center"
              />
              {RETURN_FAQS.map((item, ind) => (
                <Collapse
                  title={
                    productType.productName === "STOPWATT"
                      ? item.title.replaceAll("ESaver Watt", "StopWatt")
                      : productType.productName === "ESAVER WATT"
                        ? item.title.replaceAll("StopWatt", "ESaver Watt")
                        : ""
                  }
                  key={ind}
                >
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html:
                        productType.productName === "STOPWATT"
                          ? item.description.replaceAll(
                              "ESaver Watt",
                              "StopWatt"
                            )
                          : productType.productName === "ESAVER WATT"
                            ? item.description.replaceAll(
                                "StopWatt",
                                "ESaver Watt"
                              )
                            : ""
                    }}
                  />
                </Collapse>
              ))}
            </div>
          )}
        </Container>
      </div>

      {/* FOOTER */}
      <div className="bg-gray-700">
        <Container>
          <div className="grid grid-cols-3 py-5">
            <div className="flex cursor-pointer" onClick={scrollToPricing}>
              <Image
                src={
                  productType.productName === "STOPWATT"
                    ? LogoWhite
                    : LogoWhiteEsaver
                }
                alt="footer logo"
                className="w-64 object-contain brightness-[150%] grayscale contrast-0"
              />
            </div>
            <div className="flex flex-wrap justify-center items-start gap-1 max-w-[310px] mx-auto">
              {footerLInk.map((text, index, arr) => {
                return (
                  <Link
                    key={index}
                    href={text.links}
                    className="mr-2 my-auto"
                    target="_blank"
                  >
                    <Typography
                      variant="text"
                      text={text.text + (arr.length - 1 !== index ? " |" : "")}
                      extraClasses="!text-white !text-xs sm:!text-sm !font-normal text-center"
                    />
                  </Link>
                );
              })}
            </div>
            <Typography
              variant="text"
              text={`© Copyright 2023 ${productType.productName}`}
              extraClasses="!text-white !text-xs sm:!text-sm !font-normal text-center my-auto"
            />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default SwOffer;
