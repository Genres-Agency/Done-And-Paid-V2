import Image from "next/image";
import React from "react";
import StopIcon from "../../../public/icons/stop_icon.svg";
import LookIcon from "../../../public/icons/lookIcon.svg";
import FocusIcon from "../../../public/icons/FocusIcon.svg";

const WhyYouNeedThis = () => {
  return (
    <div
      style={{
        background: "linear-gradient(315deg, #1355FF 0%, #6C95FF 100%)",
      }}
      className="py-20"
    >
      <div className="container mx-auto text-center">
        <p className="font-semibold pb-1 text-white">Best time here</p>
        <h1 className="md:text-[54px] text-4xl text-white md:font-medium font-bold pb-14 text-center ">
          Why You Need This
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col gap-6 items-center justify-center p-10 bg-white w-full rounded-lg">
            <Image
              src={StopIcon}
              alt="linePoint"
              sizes="100vw"
              className="h-[52px] w-auto"
            />
            <p className="text-xl font-medium">
              Stop wasting hours on admin tasks that don’t pay you.
            </p>
          </div>
          <div className="flex flex-col gap-6 items-center justify-center p-10 bg-white w-full rounded-lg">
            <Image
              src={LookIcon}
              alt="linePoint"
              sizes="100vw"
              className="h-[52px] w-auto"
            />
            <p className="text-xl font-medium">
              Look more professional and get paid faster.
            </p>
          </div>
          <div className="flex flex-col gap-6 items-center justify-center p-10 bg-white w-full rounded-lg">
            <Image
              src={FocusIcon}
              alt="linePoint"
              sizes="100vw"
              className="h-[52px] w-auto"
            />
            <p className="text-xl font-medium">
              Focus on what you do best: building, fixing, and running a great
              business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyYouNeedThis;
