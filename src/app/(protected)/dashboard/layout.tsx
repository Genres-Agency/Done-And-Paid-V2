import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";
import Header from "../_components/header";
import { redirect } from "next/navigation";
import { Providers } from "./_components/providers";
import { Toaster } from "sonner";
import { currentUser } from "@/src/lib/auth";
import { ThemeProvider } from "@/src/components/providers/theme-provider";
import KBar from "@/src/components/kbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  if (!user.businessType) {
    return redirect("/business-type-selection");
  }

  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast: "group toast-group",
              title: "toast-title",
              description: "toast-description",
              actionButton: "toast-action-button",
              cancelButton: "toast-cancel-button",
              error: "toast-error",
              success: "toast-success",
              warning: "toast-warning",
              info: "toast-info",
            },
            duration: 4000,
          }}
        />
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background text-foreground">
              <KBar>
                <SidebarProvider defaultOpen={true}>
                  <AppSidebar />
                  <SidebarInset className="flex flex-col h-screen overflow-hidden">
                    <Header />
                    <div className="flex-1 overflow-y-auto">{children}</div>
                  </SidebarInset>
                </SidebarProvider>
              </KBar>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
};

export default ProtectedLayout;
