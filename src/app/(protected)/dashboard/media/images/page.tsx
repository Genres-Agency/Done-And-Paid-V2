import { Suspense } from "react";
import { Separator } from "@/src/components/ui/separator";
import { ImageGallery } from "../_components/image-gallery";
import PageContainer from "../../../_components/page-container";
import { Heading } from "@/src/components/heading";
import { LoadingPage } from "@/src/components/loading";

export const metadata = {
  title: "Dashboard : Image Gallery",
};

export default function ImagesPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Heading
          title="Image Gallery"
          description="Browse and manage your uploaded images"
        />
        <Separator />
        <Suspense fallback={<LoadingPage />}>
          <ImageGallery />
        </Suspense>
      </div>
    </PageContainer>
  );
}
