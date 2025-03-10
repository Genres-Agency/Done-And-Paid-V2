import React, { Suspense } from "react";
import { LoadingPage } from "@/src/components/loading";
import ServiceList from "./_components/service-ui/service-list";
import { getServices } from "./service-action";

const Page = async () => {
  try {
    const services = await getServices();
    return (
      <div className="overflow-x-auto">
        <Suspense fallback={<LoadingPage />}>
          <ServiceList services={services} />
        </Suspense>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">
            Failed to fetch services. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default Page;
