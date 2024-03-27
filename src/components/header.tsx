"use client";

import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { BsHandbag } from "react-icons/bs";
// import { CiInstagram } from "react-icons/ci";
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";

import { Container, Typography } from "@/components";

import Logo from "../../public/assets/images/logo.png";

import { HEADER_NAVIGATIONS } from "@/constants";

// const icons: any = {
//   facebook: FaFacebookF,
//   instagram: CiInstagram,
//   twitter: FaTwitter,
//   linkedin: FaLinkedinIn
// };

const Header: FC = (): ReactElement => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [productCount, setProductCount] = useState<number>(0);

  const handleProductCounts = useCallback(() => {
    const storedProductsCount = JSON.parse(
      localStorage.getItem("cart_products") ?? "[]"
    ).length;

    setProductCount(storedProductsCount);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "unset";
  }, [showMenu]);

  useEffect(() => {
    handleProductCounts();

    window.addEventListener("cart_products_change", () => {
      handleProductCounts();
    });
  }, [handleProductCounts]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="w-full sticky top-0 z-[999]">
      {/* <div className="bg-gray-50">
        <Container extraClasses="flex justify-between items-center py-3 max-sm:justify-center">
          <div className="flex items-center gap-4 max-sm:hidden">
            {SOCIAL_NAVIGATIONS.map(({ icon, link }) => {
              const IconComponent = icons[icon];
              return (
                <Link
                  key={icon}
                  href={link}
                  target="_blank"
                  id={`icon-social-navigation-${link}`}
                >
                  <IconComponent
                    className="text-icons-grey hover:text-primary transition-all ease-in-out duration-300"
                    size={18}
                  />
                </Link>
              );
            })}
          </div>
          <Typography
            text="Free shipping for standard order over $100"
            variant="text-small"
          />
          <div className="min-w-[120px] max-sm:hidden" />
        </Container>
      </div> */}

      {/* MOBILE SIDEBAR */}

      <div
        className={`fixed bg-white w-full h-full overflow-y-auto py-3 ${
          showMenu ? "left-0" : "-left-full"
        } bottom-0 transition-all duration-300 ease-in shadow-inner drop-shadow-xl z-[999]`}
      >
        <IoMdClose
          size={22}
          className="text-black ml-auto mr-3 cursor-pointer"
          onClick={() => setShowMenu(false)}
        />
        <nav className="flex flex-col">
          {HEADER_NAVIGATIONS.map(({ text, link }) => {
            return (
              <Link
                key={text}
                onClick={() => setShowMenu(false)}
                href={link}
                className="border-b-black border-b p-3 font-semibold hover:text-primary transition-colors duration-150 text-sm"
                id={`mobile-navigation-${text}`}
              >
                <Typography
                  text={text}
                  variant="text-small"
                  extraClasses={pathname === link ? "!text-primary" : ""}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* MOBILE SIDEBAR */}

      <div className={isScrolled ? "bg-white" : "bg-transparent"}>
        <Container extraClasses="flex justify-between items-center py-3">
          <Link href="/" className="select-none" id={"logo"}>
            <Image
              className="w-28 select-none relative left-8"
              src={Logo}
              alt="website-logo"
            />
          </Link>
          <div className="flex items-center gap-8 max-md:hidden">
            {HEADER_NAVIGATIONS.map(({ text, link }) => {
              return (
                <Link
                  key={text}
                  href={link}
                  className="flex flex-col gap-[3px] group"
                  id={`web-navigation-${text}`}
                >
                  <Typography
                    text={text}
                    variant="text"
                    extraClasses={pathname === link ? "!text-primary" : ""}
                  />
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-secondary"></span>
                </Link>
              );
            })}
          </div>
          <div className="min-w-[120px] flex justify-end items-center">
            <Link
              href="/checkout"
              className="relative"
              id={"web-navigation-checkout"}
            >
              <span className="flex justify-center items-center w-3.5 h-3.5 absolute top-0 right-0 bg-black rounded-full text-[8px] text-white">
                {productCount}
              </span>
              <BsHandbag className="text-black" size={28} />
            </Link>
            <div className="hidden max-md:block ml-3">
              <RxHamburgerMenu
                className="cursor-pointer"
                color="black"
                size={28}
                onClick={() => setShowMenu(true)}
              />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
