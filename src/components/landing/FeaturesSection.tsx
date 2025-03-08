import Image from "next/image";
import React from "react";
import ListItem from "../../../public/icons/List-Item.svg";

const FeaturesSection: React.FC = () => {
  return (
    <section className="container mx-auto pt-12 md:pt-28 pb-10 md:pb-16">
      <h2 className="md:text-[54px] text-3xl font-semibold md:pb-28 pb-10">
        Features That Actually Matter
      </h2>
      <div className="flex flex-col">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center">
            <h3 className="text-[50px] sm:text-[100px] md:text-[150px] lg:text-[224px] font-bold bg-gradient-to-b from-black to-white bg-clip-text text-transparent text-left w-full md:w-auto md:leading-none">
              0{index + 1}
            </h3>
            <Image
              src={ListItem}
              alt="ListItem"
              sizes="100vw"
              className="h-60 w-auto hidden md:block"
            />
            <div className="relative w-full">
              <div
                className="min-h-40 absolute border border-dashed border-[#1668FE] bg-[#F9F9FA] w-11/12 md:w-[476px] -z-10"
                style={{
                  boxShadow:
                    "4px -4px 10px 0px rgba(0, 0, 0, 0.10) inset, -4px 4px 10px 0px rgba(0, 0, 0, 0.10) inset",
                  borderRadius: "30px",
                }}
              ></div>
              <div
                className="w-full border border-[rgba(0, 0, 0, 0.20)] rounded-[15px] pt-7 pb-8 px-6 space-y-6 min-h-40 bg-white duration-500 hover:translate-x-5 md:hover:translate-x-7 lg:hover:translate-x-12 hover:translate-y-5 md:hover:translate-y-7 lg:hover:translate-y-12 hover:rotate-2"
                style={{
                  boxShadow: "0px 4px 60px 0px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h1 className="text-2xl font-semibold">{feature.title}</h1>
                <p className="font-normal text-[#1A1A1A99]">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const features = [
  {
    title: "🎉 Customize Your Quotes and Invoices",
    description:
      "Add your logo, company info, and any extras. Look professional, even if your boots are covered in mud.",
  },
  {
    title: "🤯 No Frills, Just Functionality",
    description:
      "We cut out all the corporate fluff so you can focus on real work.",
  },
  {
    title: "🥳 Send Reminders Without Feeling Awkward",
    description:
      "One click to gently nudge clients who haven't paid yet—no late-night stress about how to word it.",
  },
  {
    title: "🎉 Works Everywhere You Do",
    description:
      "Desktop, phone, tablet—use it from the job site, your van, or the pub.",
  },
];

export default FeaturesSection;
