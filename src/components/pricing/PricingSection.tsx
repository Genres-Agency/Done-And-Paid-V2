"use client";

import React from "react";
import { Check } from "lucide-react";
import axios from "axios";
import { Button } from "../ui/button";

type Plan = {
  title: string;
  popular: boolean;
  price: string;
  time: string;
  description: string;
  buttonText: string;
  productId: string;
  benefitList: string[];
};

const plans: Plan[] = [
  {
    title: "Free plan",
    popular: false,
    price: "€0",
    time: "month",
    description:
      "Try it before you commit. because trust starts with generosity.",
    buttonText: "Try Now",
    productId: "640769",
    benefitList: [
      "3 invoices and 3 quotes per month.",
      "VAT calculation, branding, payment tracking.",
      "Auto email sending",
      "Enough to see if it fits your workflow.",
    ],
  },
  {
    title: "Monthly Plan",
    popular: true,
    price: "€15.00",
    time: "month",
    description: "For tradespeople who don’t want limits, just results.",
    buttonText: "Get started",
    productId: "640994",
    benefitList: [
      "Unlimited invoices and quotes.",
      "Custom logos and branding",
      "Auto VAT calculations.",
      "Payment tracking (paid, unpaid, overdue).",
      "Auto reminders for late payments.",
      "One-click client emails.",
      "Downloadable PDFs",
    ],
  },
  {
    title: "Yearly Plan",
    popular: false,
    price: "€150.00",
    time: "year",
    description:
      "For tradespeople who like a good deal and hate monthly admin.",
    buttonText: "Try Now",
    productId: "640995",
    benefitList: [
      "Everything in the monthly plan.",
      "2 months free (that’s €150/year).",
      "The same unlimited simplicity, just less billing.",
    ],
  },
];

const PricingSection = () => {
  const buyProduct = async (productId: string) => {
    try {
      const response = await axios.post<{ checkoutUrl: string }>(
        "/api/purchaseProduct",
        {
          productId,
        }
      );

      if (!response.data.checkoutUrl) {
        throw new Error("Checkout URL is missing in the response");
      }

      window.open(response.data.checkoutUrl, "_blank");
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "An error occurred"
        : "An unexpected error occurred";

      console.error(error);
      alert(`Failed to buy product: ${errorMessage}`);
    }
  };

  return (
    <section className="py-10 md:py-20 bg-[#F9FAFB]">
      <div className="container mx-auto">
        <h2 className="md:text-[54px] text-4xl font-semibold pb-3 text-center">
          Pricing
        </h2>
        <h3 className="text-xl text-center pb-12">Choose you package</h3>
        {/* ------- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full md:max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={`relative pb-36 border rounded-[8px] p-8 space-y-4 min-w-72 sm:min-w-96 md:min-w-min w-full sm:max-w-80 mx-auto ${
                plan.popular
                  ? "border-[#e4ebfb] bg-[#e4ebfb] "
                  : "border-[#ABABAB] bg-white"
              }`}
            >
              <h3 className="font-semibold uppercase">{plan.title}</h3>
              <p className="text-xs font-normal text-[#ABABAB]">
                {plan.description}
              </p>
              <div className="flex items-center gap-1">
                <h1 className="text-[32px] font-semibold">{plan.price}</h1>
                <span className="text-[#2D2E2E] pt-2"> /{plan.time}</span>
              </div>
              <hr className={`${plan.popular && "border-white"}`} />
              <div className="flex flex-col gap-2 flex-grow">
                {plan.benefitList.map((benefit) => (
                  <div key={benefit} className="flex gap-2 items-start">
                    <div className="">
                      <Check className="text-[#1355FF]" />
                    </div>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="pt-8 hover:scale-95 duration-300 absolute w-10/12 left-1/2 -translate-x-1/2 bottom-8">
                <Button
                  onClick={() => buyProduct(plan.productId)}
                  // variant={plan.popular ? "default" : "secondary"}
                  className="w-full rounded-full py-3 px-7 text-white font-semibold h-[52px]"
                  style={{
                    padding: "12px 28px",
                    background: `${
                      plan.popular
                        ? "linear-gradient(315deg, #1355FF 0%, #1355FF 100%)"
                        : "linear-gradient(315deg, #000 0%, #474747 100%)"
                    }`,
                    boxShadow: `${
                      plan.popular
                        ? "0px 0.5px 0px 0px rgba(255, 255, 255, 0.32) inset, 0px -1.5px 0px 0px rgba(255, 255, 255, 0.32) inset"
                        : "0px 0.5px 0px 0px rgba(255, 255, 255, 0.32) inset, 0px -1.5px 0px 0px rgba(255, 255, 255, 0.32) inset"
                    }`,
                  }}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
        {/* -------- */}
      </div>
    </section>
  );
};

export default PricingSection;
