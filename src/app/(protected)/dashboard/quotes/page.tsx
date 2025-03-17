import React, { Suspense } from "react";
import { Metadata } from "next";
import QuoteList from "./_components/quote-ui/quote-list";
import { LoadingPage } from "@/src/components/loading";
import { getQuotes } from "./quote.action";

export const metadata: Metadata = {
  title: "Quotes | Done & Paid",
  description: "Manage all your quotes in one place",
};

export default async function QuotesPage() {
  try {
    const quotes = await getQuotes();
    return (
      <div className="overflow-x-auto">
        <Suspense fallback={<LoadingPage />}>
          <QuoteList quotes={quotes} />
        </Suspense>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">
            Failed to fetch quotes. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
