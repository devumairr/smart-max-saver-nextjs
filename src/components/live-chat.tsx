"use client";
import { useEffect } from "react";

const TidioLiveChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.tidio.co/sqpqzgpnjhch4tbrsziuqoyhf9g6hrm4.js";
    script.async = true;
    script.setAttribute("type", "text/javascript");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default TidioLiveChat;
