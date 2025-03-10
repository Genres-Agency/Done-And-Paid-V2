"use client";

import { Separator } from "@/src/components/ui/separator";
import { ProfileSettingsForm } from "./_components/profile-settings-form";
import { SecurityForm } from "./_components/security-form";
import { StoreForm } from "./_components/store-form";
import PageContainer from "../../_components/page-container";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Heading } from "@/src/components/heading";
import { Card } from "@/src/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard/settings?tab=${value}`);
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="space-y-2">
          <Heading
            title="Settings"
            description="Configure your account settings, profile information, security preferences, and store details."
          />
        </div>
        <Separator className="my-6" />
        <Card>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="border-b">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="store">Store</TabsTrigger>
              </TabsList>
            </div>
            <div className="p-6">
              <TabsContent value="profile" className="mt-0">
                <ProfileSettingsForm />
              </TabsContent>
              <TabsContent value="security" className="mt-0">
                <SecurityForm />
              </TabsContent>
              <TabsContent value="store" className="mt-0">
                <StoreForm />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </PageContainer>
  );
}
