import Image from "next/image";
import Link from "next/link";
import HeroImage from "../../../public/heroImage.png";
import { RainbowButton } from "../ui/rainbow-button";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center py-12 lg:py-20">
      <div className="text-center">
        <span className="text-sm font-medium px-3 py-1 rounded-full border border-[#9EBAF6] shadow-[0px 0px 0px 2px rgba(126, 34, 207, 0.10)] flex flex-row items-center justify-center max-w-56 mx-auto gap-1">
          <span>
            <Image
              src={"/icons/Sparkling.svg"}
              alt="Sparkling icon"
              height={25}
              width={25}
            />
          </span>{" "}
          Introducing Done & Paid
        </span>
        <div className="leading-tight mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tighter">
          <h1 className="">
            Spend more time fixing things, less time figuring out
          </h1>
          <h1 className="sm:inline-block sm:px-14 lg:px-36 relative bg-gradient-to-l from-blue-500 via-[#2563eb] to-yello-500 text-transparent bg-clip-text">
            invoices.
            <Image
              className="absolute bottom-0 left-14 sm:left-2 lg:left-20"
              src={"/icons/Cursor.svg"}
              alt="Sparkling icon"
              height={54}
              width={54}
            />
          </h1>
        </div>

        <p className="max-w-5xl mx-auto mt-4 lg:text-lg xl:text-xl text-[#5F5F5F]">
          A tool designed for tradespeople who’d rather build, fix, and install
          than wrestle with paperwork. Simple quotes, professional invoices, and
          instant client emails—all in minutes, not hours.
        </p>

        <div className="mt-7 mb-2">
          <Link href="/login">
            <RainbowButton>Start for free</RainbowButton>
          </Link>
        </div>
      </div>
      <div className="relative">
        <Image
          className="absolute md:-right-1 md:top-5 right-0 -top-7 sm:-top-5"
          src={"/icons/imgCorner.svg"}
          alt="Sparkling icon"
          height={70}
          width={45}
        />
        <Image src={HeroImage} alt="Hero image" className="" />
      </div>
    </section>
  );
}
