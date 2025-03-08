import Image from "next/image";
import Marquee from "react-fast-marquee";

const CustomerSay = [
  {
    desc: `"The real-time analytics and predictive capabilities of GEN 1 have kept us ahead in the competitive market landscape."`,
    name: "Emily Shanks",

    src: "/logos/customerSay.svg",
  },
  {
    desc: `""GEN 1's customer segmentation and marketing insights have dramatically increased our engagement and conversion rates.""`,
    name: "Emily Shanks",

    src: "/logos/customerSay.svg",
  },
  {
    desc: `"The real-time analytics and predictive capabilities of GEN 1 have kept us ahead in the competitive market landscape."`,
    name: "Emily Shanks",

    src: "/logos/customerSay.svg",
  },
  {
    desc: `""GEN 1's customer segmentation and marketing insights have dramatically increased our engagement and conversion rates.""`,
    name: "Emily Shanks",

    src: "/logos/customerSay.svg",
  },
  {
    desc: `""GEN 1's customer segmentation and marketing insights have dramatically increased our engagement and conversion rates.""`,
    name: "Emily Shanks",

    src: "/logos/customerSay.svg",
  },
  {
    desc: `""GEN 1's customer segmentation and marketing insights have dramatically increased our engagement and conversion rates.""`,
    name: "Emily Shanks",
    src: "/logos/customerSay.svg",
  },
];

const WhatOurCustomersSay: React.FC = () => {
  return (
    <div className="bg-[#F9FAFB] py-10 md:py-20">
      <h2 className="md:text-[54px] text-3xl font-bold md:font-medium pb-12 text-center container mx-auto">
        What Our Customers Say
      </h2>

      <div className="flex flex-col gap-[14px]">
        <Marquee
          speed={50}
          gradient={true}
          pauseOnHover={false}
          pauseOnClick={true}
        >
          {CustomerSay.map((customer, index) => (
            <div
              key={index}
              className="border border-[#D1D1D1] rounded-xl bg-white py-5 md:py-14 px-5 md:px-16 text-center mr-[14px] w-80 md:w-auto max-w-lg min-h-56 md:min-h-[380px] flex flex-col items-center justify-center "
            >
              <Image
                src={customer.src}
                alt={"Customer Image"}
                width={80}
                height={80}
                layout="intrinsic"
              />
              <h1 className="text-2xl font-medium py-5">{customer.name}</h1>
              <p className="md:text-xl text-[#1A1A1A]">{customer.desc}</p>
            </div>
          ))}
        </Marquee>
        <Marquee
          speed={50}
          gradient={true}
          pauseOnHover={false}
          pauseOnClick={true}
          direction="right"
        >
          {CustomerSay.map((customer, index) => (
            <div
              key={index}
              className="border border-[#D1D1D1] rounded-xl bg-white py-5 md:py-14 px-5 md:px-16 text-center mr-[14px] w-80 md:w-auto max-w-lg min-h-56 md:min-h-[380px] flex flex-col items-center justify-center "
            >
              <Image
                src={customer.src}
                alt={"Customer Image"}
                width={80}
                height={80}
                layout="intrinsic"
              />
              <h1 className="text-2xl font-medium py-5">{customer.name}</h1>
              <p className="md:text-xl text-[#1A1A1A]">{customer.desc}</p>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default WhatOurCustomersSay;
