import Image from "next/image";
import React from "react";
import imgLine from "../../../public/icons/linePoint.svg";
import Quotes from "../../../public/icons/quote.svg";
import ClientEmail from "../../../public/icons/Email.svg";
import Invoice from "../../../public/icons/Invoice.svg";
import Track from "../../../public/icons/track.svg";
import Confuse from "../../../public/icons/confuse.svg";
import ChargeIcon from "../../../public/icons/charge.svg";
import ExpectIcon from "../../../public/icons/expect.svg";

const WhatItDoes = () => {
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center py-20">
        {`What It Does (and Doesn’t Do)`}
      </h2>

      {/*  ------- Here’s what we do------------- */}
      <h3
        className="text-[#282828] font-semibold text-2xl sm:text-[30px] mb-20"
      style={{
          background:
            "linear-gradient(315deg, rgba(19, 85, 255, 0.10) 0%, rgba(108, 149, 255, 0.10) 100%)",
          boxShadow: "0px 20.716px 18.644px 0px rgba(25, 106, 254, 0.10)",
          borderRadius: "39px",
          padding: "16px 39px",
        }}
      >
        {`Here’s what we do`}
      </h3>

      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="flex flex-row items-start gap-9 w-full lg:w-1/2">
          <Image
            src={imgLine}
            alt="linePoint"
            sizes="100vw"
            className="h-full w-auto"
          />
          <div className="flex flex-col gap-16">
            <div>
              <Image
                src={Quotes}
                alt="Quotes Icon"
                sizes="100vw"
                className="h-auto w-12"
              />
              <h2 className="text-2xl font-bold pt-6 pb-4">
                Quotes that look good
              </h2>
              <p>
                No more scribbling on the back of a receipt. Send polished
                quotes that impress clients and win jobs.
              </p>
            </div>
            <div>
              <Image
                src={ClientEmail}
                alt="Quotes Icon"
                sizes="100vw"
                className="h-auto w-12"
              />
              <h2 className="text-2xl font-bold pt-6 pb-4">
                Client emails, handled
              </h2>
              <p>
                Send invoices directly to your clients with one click. They get
                the email, you get paid.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-start gap-9 w-full lg:w-1/2">
          <Image
            src={imgLine}
            alt="linePoint"
            sizes="100vw"
            className="h-full w-auto"
          />
          <div className="flex flex-col gap-16">
            <div>
              <Image
                src={Invoice}
                alt="Quotes Icon"
                sizes="100vw"
                className="h-auto w-12"
              />
              <h2 className="text-2xl font-bold pt-6 pb-4">
                Invoices made easy
              </h2>
              <p>
                {`Fill in the job details, hit "generate," and boom—you’re done.`}
              </p>
            </div>
            <div>
              <Image
                src={Track}
                alt="Quotes Icon"
                sizes="100vw"
                className="h-auto w-12"
              />
              <h2 className="text-2xl font-bold pt-6 pb-4">
                Track payments effortlessly
              </h2>
              <p>
                {`Know exactly who’s paid, who hasn’t, and when to nudge them.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*  ----------   Here’s what we don’t do -----------  */}
      <h3
        className="text-[#282828] font-semibold text-2xl sm:text-[30px] mb-20 text-right mt-40"
        style={{
          background:
            "linear-gradient(315deg, rgba(19, 85, 255, 0.10) 0%, rgba(108, 149, 255, 0.10) 100%)",
          boxShadow: "0px 20.716px 18.644px 0px rgba(25, 106, 254, 0.10)",
          borderRadius: "39px",
          padding: "16px 39px",
        }}
      >
        {`Here’s what we don’t do`}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-14 pb-20">
        <div className="flex items-center text-center justify-center flex-col gap-6">
          <Image
            src={Confuse}
            alt="Confuse Icon"
            sizes="100vw"
            className="h-auto w-12"
          />
          <h2 className="text-[22px] font-bold">
            Confuse you with 50 useless features.
          </h2>
        </div>
        <div className="flex items-center text-center justify-center flex-col gap-6">
          <Image
            src={ChargeIcon}
            alt="Confuse Icon"
            sizes="100vw"
            className="h-auto w-12"
          />
          <h2 className="text-[22px] font-bold">
            Charge a fortune for something basic.
          </h2>
        </div>
        <div className="flex items-center text-center justify-center flex-col gap-6">
          <Image
            src={ExpectIcon}
            alt="Confuse Icon"
            sizes="100vw"
            className="h-auto w-16"
          />
          <h2 className="text-[22px] font-bold">
            Expect you to be a tech wizard.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default WhatItDoes;
