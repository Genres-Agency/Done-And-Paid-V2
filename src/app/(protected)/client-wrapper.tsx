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
    if (!user?.businessType && pathname !== "/business-type-selection") {
      router.replace("/business-type-selection");
    } else if (user?.businessType && pathname === "/business-type-selection") {
      router.replace("/dashboard");
    }
  }, [user?.businessType, pathname, router]);

  return <>{children}</>;
}
