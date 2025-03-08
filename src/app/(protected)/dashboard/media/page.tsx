import { Suspense } from "react";
import { Separator } from "@/src/components/ui/separator";
import { MediaStats } from "./_components/media-stats";
import { RecentUploads } from "./_components/recent-uploads";
import PageContainer from "../../_components/page-container";
import { Heading } from "@/src/components/heading";
import { LoadingPage } from "@/src/components/loading";

export const metadata = {
  title: "Dashboard : Media Library",
};

export default function MediaPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Heading
          title="Media Library"
          description="Manage your images and videos in one place"
        />
        <Separator />
        <Suspense fallback={<LoadingPage />}>
          <MediaStats />
        </Suspense>
        <Suspense fallback={<LoadingPage />}>
          <RecentUploads />
        </Suspense>
      </div>
    </PageContainer>
  );
}
