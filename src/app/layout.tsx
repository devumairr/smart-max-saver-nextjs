import { FC, PropsWithChildren, ReactElement } from "react";
import type { Metadata } from "next";
import { Inter, Roboto, Poppins } from "next/font/google";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { LIVEChat } from "@/components";
const montserrat: NextFontWithVariable = localFont({
  src: [
    {
      path: "../../public/assets/fonts/montserrat/montserrat-regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../public/assets/fonts/montserrat/montserrat-medium.ttf",
      weight: "500",
      style: "normal"
    },
    {
      path: "../../public/assets/fonts/montserrat/montserrat-semiBold.ttf",
      weight: "600",
      style: "normal"
    },
    {
      path: "../../public/assets/fonts/montserrat/montserrat-bold.ttf",
      weight: "700",
      style: "normal"
    },
    {
      path: "../../public/assets/fonts/montserrat/montserrat-extraBold.ttf",
      weight: "800",
      style: "normal"
    }
  ],
  variable: "--font-montserrat"
});
const inter: NextFontWithVariable = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});
const roboto: NextFontWithVariable = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: "400"
});
const poppins: NextFontWithVariable = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: "400"
});
export const metadata: Metadata = {
  title: "Smart Max Saver",
  description: "Save Energy Every Second..."
};
const RootLayout: FC<PropsWithChildren> = ({ children }): ReactElement => {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} ${inter.variable} ${roboto.variable} ${poppins.variable} w-full overflow-x-hidden`}
      >
        <Script id="clarity" type="text/javascript">
          {`(function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
            t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", "i4xamtp90e");`}
        </Script>
        <Script
          id="widget"
          src="https://widget.clym-sdk.net/blocking.js"
          type="text/javascript"
        >
          {`(function (d, s, i, w, o) {
                    var js,
                         cjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(i)) return;
                    js = d.createElement("script");
                    js.id = i;
                    js.src = "https://widget.clym-sdk.net/clym.js";
                    js.onload = function () {
                         Clym && Clym.load(i, w, o);
                    };
                    js.async = 1;
                    cjs.parentNode.insertBefore(js, cjs);
               })(document, "script", "clym-privacy", "aea8fdece1e74c68bd4d46cdytutpgoc", {});`}
        </Script>
        <Script id="hotjar" type="text/javascript">
          {`(function (h, o, t, j, a, r) {
          h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
          h._hjSettings = { hjid: 3643411, hjsv: 6 };
          a = o.getElementsByTagName('head')[0];
          r = o.createElement('script'); r.async = 1;
          r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
          a.appendChild(r);
          })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');`}
        </Script>

        <main>
          <LIVEChat />
          {children}
        </main>
      </body>
    </html>
  );
};
export default RootLayout;
