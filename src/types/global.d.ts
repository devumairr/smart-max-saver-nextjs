/* eslint-disable no-unused-vars */

import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactElement,
  SelectHTMLAttributes,
  VideoHTMLAttributes
} from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

declare global {
  type ExtendStyles = {
    extraClasses?: string;
  };

  interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    variant:
      | "contained-pill"
      | "contained-pill-white"
      | "contained-square-white"
      | "gradient";
    endIcon?: ReactElement;
  }

  interface IVideo extends VideoHTMLAttributes<HTMLVideoElement> {
    source: string;
  }

  interface ITextInput extends InputHTMLAttributes<HTMLInputElement> {
    variant: "underline" | "outline";
    isValid?: boolean;
    isError?: boolean;
  }

  interface IOption {
    id: string;
    label: string;
  }

  interface ISelect extends SelectHTMLAttributes<HTMLSelectElement> {
    variant: "underline" | "outline";
    options: IOption[];
    isError?: boolean;
    isValid?: boolean;
  }

  interface ISocialLink {
    icon: string;
    link: string;
  }

  interface ILink {
    text: string;
    link: string;
  }

  interface Typography {
    text: string;
    variant:
      | "main-heading"
      | "sub-heading"
      | "heading"
      | "text"
      | "text-normal"
      | "text-small"
      | "unordered-list"
      | "list-item";
    dangerouslySetInnerHTML?:
      | {
          __html: string | TrustedHTML;
        }
      | undefined;
  }

  interface ITextBox {
    text: string;
    imageSource: string | StaticImport;
    isActive?: boolean;
    isInvert?: boolean;
  }

  interface IProduct {
    productId: number;
    productName: string;
    price: string;
    imageUrl: string;
    productType: string;
    stockQuantity: string;
    productTags: string[];
    productImages?: string[];
    price?: number | string;
  }

  type Offers = "sw9pwtyk" | "es9pwtyk";
}
