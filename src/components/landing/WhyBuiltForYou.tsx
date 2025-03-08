import Image from "next/image";
import Link from "next/link";
import React from "react";
import ImgSrc from "../../../public/Why-Built-for-You.png";
import { RainbowButton } from "../ui/rainbow-button";

const WhyBuiltForYou = () => {
  return (
    <div
      style={{
        background: "linear-gradient(315deg, #1355FF 0%, #6C95FF 100%)",
      }}
      className="pt-20"
    >
      <div className="container mx-auto">
        <div className="text-white text-center mb-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="md:text-[54px] text-3xl font-bold text-center">
              Why It’s Built for You
            </h1>
            <p className="md:text-xl text-lg mt-4">
              We get it—you work with your hands, not spreadsheets. You need a
              tool that’s straightforward, tough, and gets the job done without
              needing a tutorial. That’s why our interface is cleaner than your
              freshly wiped workbench, and our features are exactly what you
              need—nothing more, nothing less.
            </p>
          </div>
          <div className="mt-7 mb-2">
            <Link href="/login">
              <RainbowButton className="bg-white">Start for free</RainbowButton>
            </Link>
          </div>
        </div>
        <Image
          src={ImgSrc}
          alt="Picture of the author"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
};

export default WhyBuiltForYou;
