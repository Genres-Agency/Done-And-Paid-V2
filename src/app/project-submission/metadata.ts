import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Your Project - GenRes | Custom Development Solutions",
  description:
    "Transform your ideas into reality with GenRes. Submit your project request for custom software development, web applications, and digital solutions. Get expert consultation and tailored development services.",
  openGraph: {
    title: "Submit Your Project - GenRes | Custom Development Solutions",
    description:
      "Transform your ideas into reality with GenRes. Submit your project request for custom software development, web applications, and digital solutions. Get expert consultation and tailored development services.",
    type: "website",
    url: "https://done-and-paid-v2.vercel.app/project-submission",
    siteName: "GenRes",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.svg",
        width: 1200,
        height: 630,
        alt: "GenRes - Your Project Development Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit Your Project - GenRes | Custom Development Solutions",
    description:
      "Transform your ideas into reality with GenRes. Submit your project request for custom software development, web applications, and digital solutions. Get expert consultation and tailored development services.",
    site: "@genres_dev",
    creator: "@genres_dev",
    images: [
      {
        url: "/opengraph-image.svg",
        width: 1200,
        height: 630,
        alt: "GenRes - Your Project Development Partner",
      },
    ],
  },
  alternates: {
    canonical: "https://done-and-paid-v2.vercel.app/project-submission",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
