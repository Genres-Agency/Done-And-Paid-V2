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

export default async function SettingsPage() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="space-y-2">
          <Heading
            title="Settings"
            description="  Configure your account settings, profile information, security
            preferences, and store details."
          />
        </div>
        <Separator className="my-6" />
        <Card className="border-none shadow-sm">
          <Tabs defaultValue="profile" className="w-full">
            <div className="border-b">
              <TabsList className="w-full justify-start gap-6 rounded-none border-b-0 bg-transparent p-0">
                <TabsTrigger
                  value="profile"
                  className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Profile & General
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="store"
                  className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Store Information
                </TabsTrigger>
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
