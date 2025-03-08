import Link from "next/link";
import React from "react";
import HedBorder from "../../../public/icons/HeaderBorder.svg";
import GetStarted from "../../../public/GetStartedSec.png";
import Image from "next/image";
import { RainbowButton } from "../ui/rainbow-button";

const GetStartedToday = () => {
  return (
    <div className="py-20 w-full bg-white">
      <div className="container mx-auto text-center py-24 relative">
        <Image
          src={GetStarted}
          alt="linePoint"
          sizes="100vw"
          className="h-full w-full object-cover absolute top-0 left-0"
        />

        <div className="relative inline-block mx-auto px-12 ">
          <h1 className="text-3xl font-semibold text-[#171717] text-center">
            Get Started Today
          </h1>
          <Image
            src={HedBorder}
            alt="Head Border"
            sizes="100vw"
            className="h-auto w-full absolute -bottom-3 left-0"
          />
        </div>
        <p className="text-lg max-w-[600px] mx-auto py-7">
          Your first 10 invoices are on us—no card required. Because you’ve got
          real work to do, and we’ve got your back.
        </p>
        <Link href="/login">
          <RainbowButton>Start free</RainbowButton>
        </Link>
      </div>
    </div>
  );
};

export default GetStartedToday;
