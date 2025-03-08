import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

// Use Inter with expanded subsets for better language support
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const APP_NAME = "Done & Paid";
const APP_DEFAULT_TITLE =
  "Done & Paid - Spend more time fixing things, less time figuring out invoices.";
const APP_TITLE_TEMPLATE = "%s - PWA App";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL as string),
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description:
    "Spend more time fixing things, less time figuring out invoices.",

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title:
      "Done & Paid - Spend more time fixing things, less time figuring out invoices.",
    description:
      "Spend more time fixing things, less time figuring out invoices.",
    images: [
      {
        url: "./opengraph-image.jpg",
        alt: "Done & Paid - Spend more time fixing things, less time figuring out invoices.",
        width: "100%",
        height: "100%",
      },
    ],
  },
  twitter: {
    title:
      "Done & Paid - Spend more time fixing things, less time figuring out invoices.",
    images: [
      {
        url: "./opengraph-image.jpg",
        alt: "Done & Paid - Spend more time fixing things, less time figuring out invoices.",
        width: "100%",
      },
    ],
  },
  keywords: [
    "invoice management",
    "saas invoicing tool",
    "online invoicing software",
    "billing and payment platform",
    "invoice automation",
    "small business invoicing",
    "freelancer billing tool",
    "simple invoice software",
    "professional invoice templates",
    "cloud-based invoicing",
    "recurring payments management",
    "expense tracking and invoicing",
    "time tracking and billing",
    "digital invoice solution",
    "effortless invoice payments",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body
          className={`${inter.className} antialiased min-h-screen bg-background`}
        >
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1 animate-fade-in">{children}</main>
          </div>

          <NextTopLoader
            color="#3b81f3"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px rgba(59, 129, 243, 0.5), 0 0 5px rgba(59, 129, 243, 0.5)"
          />
          <Toaster
            position="top-center"
            toastOptions={{
              unstyled: true,
              classNames: {
                toast: "group toast-group",
                title: "toast-title",
                description: "toast-description",
                actionButton: "toast-action-button",
                cancelButton: "toast-cancel-button",
                error: "toast-error",
                success: "toast-success",
                warning: "toast-warning",
                info: "toast-info",
              },
              duration: 4000,
            }}
          />
        </body>
      </html>
    </SessionProvider>
  );
}
