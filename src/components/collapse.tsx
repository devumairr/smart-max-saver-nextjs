"use client";
import React, { ReactElement, useState } from "react";
import { PiMinusBold, PiPlusBold } from "react-icons/pi";

const Collapse = ({
  title,
  children
}: {
  title: string;
  children: ReactElement;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" rounded">
      <div
        className="flex items-center gap-2 px-4 py-2 cursor-pointer transition-all duration-300 ease-in-out"
        onClick={toggleCollapse}
      >
        <div className="flex justify-center transition-all duration-500 items-center rounded-full p-1 bg-[#2e3a4b] text-white !text-base sm:text-lg">
          {!isOpen ? <PiPlusBold /> : <PiMinusBold />}
        </div>
        <h3
          className={`text-lg font-bold hover:text-[#5aa833] ${
            isOpen ? "text-[#5aa833]" : "text-black"
          }`}
        >
          {title}
        </h3>
      </div>
      <div
        className={`px-4 ml-8 transition-all duration-500 ${
          isOpen ? "max-h-96 py-2" : "py-0 max-h-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapse;
