import FeaturesSection from "../components/landing/FeaturesSection";
import Footer from "../components/landing/footer/Footer";
import GetStartedToday from "../components/landing/GetStartedToday";
import { Hero } from "../components/landing/Hero";
import LogoCarousel from "../components/landing/LogoCarousel";
import NavBar from "../components/landing/Navbar";
import WhatItDoes from "../components/landing/WhatItDoes";
import WhatOurCustomersSay from "../components/landing/WhatOurCustomersSay";
import WhyBuiltForYou from "../components/landing/WhyBuiltForYou";
import WhyWeBuiltThis from "../components/landing/WhyWeBuild";
import WhyYouNeedThis from "../components/landing/WhyYouNeedThis";
import PricingSection from "../components/pricing/PricingSection";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
        </div>
        <LogoCarousel />
        <WhyWeBuiltThis />
        <WhatItDoes />
        <WhyBuiltForYou />
        <FeaturesSection />
        <PricingSection />
        <WhatOurCustomersSay />
        <WhyYouNeedThis />
        <GetStartedToday />
      </main>
      <Footer />
    </>
  );
}
