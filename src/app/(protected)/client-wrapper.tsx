"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type ClientWrapperProps = {
  children: React.ReactNode;
  user: any;
};

export default function ClientWrapper({ children, user }: ClientWrapperProps) {
  const pathname = usePathname() || "/";
  const router = useRouter();

  useEffect(() => {
    // Redirect to business type selection if not set
    if (
      !user?.businessType &&
      pathname !== "/business-type-selection" &&
      pathname !== "/"
    ) {
      router.replace("/business-type-selection");
      return;
    }

    // Redirect to dashboard if business type is set and user is on selection page
    if (user?.businessType && pathname === "/business-type-selection") {
      router.replace("/dashboard");
    }
  }, [user?.businessType, pathname, router]);

  return <>{children}</>;
}
