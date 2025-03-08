import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="w-full container mx-auto px-5 py-10 pt-0 md:py-20 md:mt-20">
      <div className=" flex flex-col lg:flex-row gap-5 justify-between">
        {/* Logo and Description */}
        <div className=" max-w-96">
          {/* Logo */}
          <Link href={"/"}>
            <Image
              src={"/logo.png"}
              alt={"Done & Paid Logo"}
              width={180}
              height={180}
            />
          </Link>
          <p className="text-sm text-gray-400 mt-3">
            A tool designed for tradespeople who’d rather build, fix, and
            install than wrestle with paperwork. Simple quotes, professional
            invoices, and instant client emails—all in minutes, not hours.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Product</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/#features" className="text-gray-400 ">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-gray-400 ">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-gray-400 ">
                Changelog
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-gray-400 ">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy-policy" className="text-gray-400 ">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="text-gray-400 ">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="text-gray-400 ">
                Security
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy-policy" className="text-gray-400 ">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="text-gray-400 ">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="text-gray-400 ">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Social Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Social</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy-policy" className="text-gray-400 ">
                Follow on LinkedIn
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="text-gray-400 ">
                Follow on X
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="text-gray-400 ">
                Follow on Instagram
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className=" mt-12 pt-4 text-center text-gray-500">
        <p>
          All rights reserved. &copy; {new Date().getFullYear()}{" "}
          <Link href={"https://www.genres-agency.com/en"}>GenRes</Link>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
