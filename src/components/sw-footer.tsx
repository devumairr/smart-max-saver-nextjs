import { FC, ReactElement } from "react";
import { Container, Typography } from "../components";
import Link from "next/link";

const SwFooter: FC = (): ReactElement => {
  return (
    <footer>
      <div className="bg-[#414040] py-10">
        <Container>
          <div className="m-auto w-full flex gap-8 pb-5 px-4">
            <div className="w-1/2">
              <Typography
                text="INFORMATION"
                variant="heading"
                extraClasses="!text-white !font-bold !text-[16px]"
              />
              <div className="border-t-[1px] border-[#696868] "></div>
              <div className="flex flex-col pt-4">
                <Link
                  href="/terms-conditions"
                  className="text-white leading-7 w-[26%] hover:text-[#898888]"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-white leading-7 w-[19%] hover:text-[#898888]"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/contact-us"
                  className="text-white leading-7 w-[16%] hover:text-[#898888]"
                >
                  Contact Us
                </Link>
                <Link
                  href="/"
                  className="text-white leading-7 w-[20%] hover:text-[#898888]"
                >
                  Privacy Center
                </Link>
                <Link
                  href="/"
                  className="text-white leading-7 w-[60%] hover:text-[#898888]"
                >
                  Do not sell or share my personal information
                </Link>
              </div>
            </div>
            <div className="w-1/2">
              <Typography
                text="GUARANTEE"
                variant="heading"
                extraClasses="!text-white !font-bold !text-[16px]"
              />
              <div className="border-t-[1px] border-[#696868] "></div>
              <div className="flex flex-col pt-4">
                <Typography
                  text="We offer a 60-Days money-back guarantee"
                  variant="text"
                  extraClasses="!text-white !font-light"
                />
              </div>
            </div>
          </div>
          <div className="border-t-[1px] border-[#696868]"></div>
          <div className="pt-5">
            <Typography
              text="2024 Copyright © StopWatt. All Rights Reserved."
              variant="text"
              extraClasses="!text-white !font-light !text-center"
            />
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default SwFooter;
