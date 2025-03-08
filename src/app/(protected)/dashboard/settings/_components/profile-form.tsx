"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useState, useTransition } from "react";
import { MediaSelectorModal } from "../../media/_components/MediaSelectorModal";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { uploadToImageBB } from "@/src/lib/image-upload";
import { settings } from "@/src/actions/auth/settings";
export function ProfileForm() {
  const user = useCurrentUser();
  const { update } = useSession();
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConceal = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowMediaSelector(false);
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      startTransition(async () => {
        const imageUrl = await uploadToImageBB(selectedFile);
        const response = await settings({ image: imageUrl });

        if (response.error) {
          toast.error(response.error);
          return;
        }

        await update();
        toast.success("Profile image updated successfully");
        setSelectedFile(null);
        setShowMediaSelector(false);
      });
    } catch (error) {
      toast.error("Failed to update profile image");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={previewUrl || user?.image || ""} />
            <AvatarFallback>
              {user?.name?.charAt(0) || user?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            {!selectedFile ? (
              <Button
                variant="outline"
                onClick={() => setShowMediaSelector(true)}
              >
                Change avatar
              </Button>
            ) : (
              <>
                <Button onClick={handleConceal} variant="outline">
                  Conceal
                </Button>
                <Button onClick={handleSave} disabled={isPending}>
                  {isPending ? "Saving..." : "Save changes"}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <MediaSelectorModal
        open={showMediaSelector}
        onOpenChange={setShowMediaSelector}
        onMediaSelect={() => {}}
        onFileSelect={handleFileSelect}
        allowedTypes={["upload"]}
        showLibrary={false}
        reset={false}
      />
    </Card>
  );
}
