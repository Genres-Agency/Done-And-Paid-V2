import { Separator } from "@/src/components/ui/separator";
import { UploadForm } from "../_components/upload-form";
import PageContainer from "../../../_components/page-container";
import { Heading } from "@/src/components/heading";

export const metadata = {
  title: "Dashboard : Upload Media",
};

export default function UploadPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Heading
          title="Upload Media"
          description="Upload images and videos to your media library"
        />
        <Separator />
        <UploadForm />
      </div>
    </PageContainer>
  );
}
