import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      animation: {
        "pulse-loader": "pulse-loader 1s linear infinite",
        "bounce-left": "bounce-left 1s infinite",
        "bounce-right": "bounce-right 1s infinite"
      },
      keyframes: {
        "pulse-loader": {
          "0%": {
            transform: "scale(0)",
            opacity: "1"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "0"
          }
        },
        "bounce-right": {
          "0%, 100%": {
            transform: "translateX(0)"
          },
          "50%": {
            transform: "translateX(12px)"
          }
        },
        "bounce-left": {
          "0%, 100%": {
            transform: "translateX(0)"
          },
          "50%": {
            transform: "translateX(-12px)"
          }
        }
      },
      fontFamily: {
        inter: "var(--font-inter)",
        montserrat: "var(--font-montserrat)",
        roboto: "var(--font-roboto)",
        poppin: "var(--font-poppin)"
      },
      colors: {
        primary: "#e65540",
        secondary: "#686868",
        "secondary-dark": "#252525",
        "light-black": "#080405",
        grey: "#7B7B7B",
        "product-background": "#EAEAE8",
        "icons-grey": "#ADADAD",
        "light-grey": "#9A959A",
        "light-gray": "#e6e6e6",
        "input-border": "#9A9A9A",
        "shape-grey": "#C3C2C2",
        "header-grey": "#808080",
        badge: "#66A8A6",
        green: "#89c53f",
        "brand-green": "#197317",
        "green-600": "#16a34a",
        "t-yellow": "#ffd748 "
      },
      backgroundImage: {
        "master-slide": "url('/assets/images/master-slide-01.jpg')",
        "header-bg": "url('/assets/images/banner-top.jpg')",
        "main-slider": "url('/assets/images/main_slider_background.png')",
        "stopwatt-banner": "url('/assets/images/stopwatt-bg.jpeg')",
        "stopwatt-banner-mobile":
          "url('/assets/images/stopwatt-bg-mobile.png')",
        "thunder-bullet": "url(/assets/images/thunder.svg)",
        "stopwatt-box": "url(/assets/images/stopwatt-box.jpeg)",
        "esaver-box": "url(/assets/images/esaver-box.jpg)",
        "review-banner": "url(/assets/images/review-bg.jpeg)",
        "products-banner": "url(/assets/images/products-bg.jpeg)",
        "checkout-banner": "url(/assets/images/checkout-banner.png)",
        "thankyou-banner": "url(/assets/images/ty-bg.png)"
      },
      boxShadow: {
        "notify-popup": "0 0 5px #6f6f6f"
      },
      borderColor: {
        grey: "#888888",
        "light-grey": "#c4c4c4",
        green: "#89c53f"
      }
    }
  },
  plugins: []
};
export default config;
