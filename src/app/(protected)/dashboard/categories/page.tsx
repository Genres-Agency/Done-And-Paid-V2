import { Suspense } from "react";
import CategoriesListPage from "./_components/categories-ui/all-categories-page";
import { LoadingPage } from "@/src/components/loading";

const CategoriesPage = () => {
  return (
    <div>
      <Suspense fallback={<LoadingPage />}>
        <CategoriesListPage />
      </Suspense>
    </div>
  );
};

export default CategoriesPage;
