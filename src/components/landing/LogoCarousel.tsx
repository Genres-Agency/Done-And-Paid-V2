import Image from "next/image";
import Marquee from "react-fast-marquee";
import { FC } from "react";

const logos = [
  { src: "/logos/logo3.png", alt: "Airbnb" },
  { src: "/logos/logo1.png", alt: "Facebook" },
  { src: "/logos/logo2.png", alt: "Disney" },
  { src: "/logos/logo3.png", alt: "Airbnb" },
  { src: "/logos/logo4.png", alt: "Apple" },
  { src: "/logos/logo5.png", alt: "Spark" },
  { src: "/logos/logo1.png", alt: "Facebook" },
  { src: "/logos/logo4.png", alt: "Apple" },
  { src: "/logos/logo2.png", alt: "Sass" },
  { src: "/logos/logo6.png", alt: "Samsung" },
  { src: "/logos/logo7.png", alt: "Quora" },
  { src: "/logos/logo2.png", alt: "Sass" },
];

const LogoCarousel: FC = () => {
  return (
    <div className="md:pb-20">
      <Marquee
        speed={50}
        gradient={true}
        pauseOnHover={false}
        pauseOnClick={true}
      >
        {logos.map((logo, index) => (
          <Image
            key={index}
            src={logo.src}
            alt={logo.alt}
            width={120}
            height={60}
            className="ml-12"
            layout="intrinsic"
          />
        ))}
      </Marquee>
    </div>
  );
};

export default LogoCarousel;
