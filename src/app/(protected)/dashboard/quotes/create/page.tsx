import { Metadata } from "next";
import { Heading } from "@/src/components/heading";
import Link from "next/link";
import { Separator } from "@/src/components/ui/separator";
import PageContainer from "../../../_components/page-container";
import { QuoteForm } from "./_components/quote-form";
import { Suspense } from "react";
import { LoadingPage } from "@/src/components/loading";
import { Button } from "@/src/components/ui/button";

export const metadata: Metadata = {
  title: "Create Quote | Done & Paid",
  description: "Create a new quote for your customer",
};

export default async function CreateQuotePage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Create New Quote`}
            description="Create and customize your quote"
          />
          <Button
            asChild
            variant="default"
            size="sm"
            className="hover:bg-primary/90"
          >
            <Link href="#preview">Preview Quote</Link>
          </Button>
        </div>
        <Separator />
        <Suspense fallback={<LoadingPage />}>
          <QuoteForm />
        </Suspense>
      </div>
    </PageContainer>
  );
}
