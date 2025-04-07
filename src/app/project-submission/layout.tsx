import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Your Project - GenRes",
  description:
    "Submit your project details and requirements. We'll review your submission and get back to you with a tailored solution that meets your needs.",
  keywords:
    "project submission, custom solutions, development services, GenRes",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Submit Your Project - GenRes",
    description:
      "Submit your project details and requirements. We'll review your submission and get back to you with a tailored solution that meets your needs.",
    type: "website",
    url: "https://genres.com/project-submission",
    siteName: "GenRes",
    images: [
      {
        url: "/opengraph-image.svg",
        width: 1200,
        height: 630,
        alt: "GenRes Project Submission",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit Your Project - GenRes",
    description:
      "Submit your project details and requirements. We'll review your submission and get back to you with a tailored solution that meets your needs.",
    images: ["/opengraph-image.svg"],
  },
};

export default function ProjectSubmissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto py-8">{children}</div>
    </section>
  );
}
