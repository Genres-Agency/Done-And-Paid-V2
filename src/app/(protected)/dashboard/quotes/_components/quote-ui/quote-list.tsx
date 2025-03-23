"use client";

import React from "react";
import { QuoteWithCustomer } from "@/src/types/quote";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "@/src/app/(protected)/_components/table/data-table";
import PageContainer from "@/src/app/(protected)/_components/page-container";

interface QuoteListProps {
  quotes: QuoteWithCustomer[];
}

export default function QuoteList({ quotes }: QuoteListProps) {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quotes</h2>
            <p className="text-muted-foreground">
              {`Here's a list of your quotes`}
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/quotes/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Quote
            </Link>
          </Button>
        </div>
        <DataTable columns={columns} data={quotes} searchKey="customerName" />
      </div>
    </PageContainer>
  );
}
