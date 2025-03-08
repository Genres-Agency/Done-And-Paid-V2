import { Suspense } from "react";
import { Separator } from "@/src/components/ui/separator";
import { VideoGallery } from "../_components/video-gallery";
import PageContainer from "../../../_components/page-container";
import { Heading } from "@/src/components/heading";
import { LoadingPage } from "@/src/components/loading";

export const metadata = {
  title: "Dashboard : Video Management",
};

export default function VideosPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Heading
          title="Video Management"
          description="Browse and manage your uploaded videos"
        />
        <Separator />
        <Suspense fallback={<LoadingPage />}>
          <VideoGallery />
        </Suspense>
      </div>
    </PageContainer>
  );
}
