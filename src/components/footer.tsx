import React, { FC, ReactElement } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

// import { CiInstagram } from "react-icons/ci";
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

import { Container, Typography } from "@/components";

import {
  CATEGORIES_NAVIGATIONS,
  FOOTER_NAVIGATIONS
  // SOCIAL_NAVIGATIONS
} from "@/constants";

import Paypal from "../../public/assets/images/paypal.png";
import Visa from "../../public/assets/images/visa.png";
import Debit from "../../public/assets/images/debit.png";
import AmericanExpress from "../../public/assets/images/american-express.png";
import Discover from "../../public/assets/images/discover.png";

// const icons: any = {
//   facebook: FaFacebookF,
//   instagram: CiInstagram,
//   twitter: FaTwitter,
//   linkedin: FaLinkedinIn
// };

const paymentIcons: StaticImageData[] = [
  Paypal,
  Visa,
  Debit,
  AmericanExpress,
  Discover
];

const Footer: FC = (): ReactElement => {
  return (
    <footer className="w-full">
      <div className="bg-brand-green">
        <Container extraClasses="!max-w-[1150px] pt-16 pb-12">
          <div className="w-full grid grid-cols-3 max-lg:grid-cols-1 gap-8">
            <div className="flex flex-col items-start max-md:items-center max-lg:items-center">
              <Typography
                text="GET IN TOUCH"
                variant="text"
                extraClasses="mb-5 text-t-yellow"
              />
              <Typography
                text="If you have any questions or require assistance, feel free to reach out to us at (833) 520 5397"
                variant="text-small"
                extraClasses="mb-5 leading-5 max-w-[400px] max-md:text-center !text-white"
              />
              {/* <div className="flex items-center gap-6">
                {SOCIAL_NAVIGATIONS.map(({ icon, link }) => {
                  const IconComponent = icons[icon];
                  return (
                    <Link
                      key={icon}
                      href={link}
                      target="_blank"
                      id={`footer-social-${link}`}
                    >
                      <IconComponent
                        className="text-white hover:text-primary transition-all ease-in-out duration-300"
                        size={22}
                      />
                    </Link>
                  );
                })}
              </div> */}
            </div>
            <div className="col-span-2 max-lg:col-span-1 grid grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 gap-8">
              <div className="flex flex-col items-start max-md:items-center">
                <Typography
                  text="CATEGORIES"
                  variant="text"
                  extraClasses="mb-5 text-t-yellow"
                />
                <div className="flex flex-col items-start max-md:items-center gap-5">
                  {CATEGORIES_NAVIGATIONS.map(({ text, link }) => {
                    return (
                      <Link
                        key={text}
                        href={link}
                        id={`footer-category-${link}`}
                      >
                        <Typography
                          text={text}
                          variant="text-small"
                          extraClasses="text-white hover:text-primary"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col items-start max-md:items-center">
                <Typography
                  text="LINKS"
                  variant="text"
                  extraClasses="mb-5 text-t-yellow"
                />
                <div className="flex flex-col items-start max-md:items-center gap-5">
                  {FOOTER_NAVIGATIONS.map(({ text, link }) => {
                    return (
                      <Link
                        key={text}
                        href={link}
                        id={`footer-navigation-${link}`}
                      >
                        <Typography
                          text={text}
                          variant="text-small"
                          extraClasses="text-white hover:text-primary"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-black p-4 ">
        <Container extraClasses="!max-w-[1150px] flex justify-between items-center">
          <Typography
            text="Copyright © 2024 Smart E Saver. All rights reserved."
            variant="text-small"
            extraClasses="text-center text-white"
          />
          <div className="flex justify-center items-center gap-5">
            {paymentIcons.map((icon, index) => {
              return (
                <Link
                  href="/"
                  scroll={false}
                  key={`payment-method-${index + 1}`}
                  id={`footer-payment-method-${index}`}
                >
                  <Image
                    className="w-8"
                    src={icon}
                    alt={`payment-method-${index + 1}`}
                  />
                </Link>
              );
            })}
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
