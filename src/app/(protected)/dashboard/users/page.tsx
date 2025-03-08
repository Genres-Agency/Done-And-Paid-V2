import React, { Suspense } from "react";
import UsersListPage from "./_components/user-ui/all-users-page";
import ErrorBoundary from "./_components/ErrorBoundary";
import { UserRole } from "@prisma/client";
import { LoadingPage } from "@/src/components/loading";
import { RoleGuard } from "@/src/components/auth/role-guard";

export const metadata = {
  title: "Dashboard : Users Management",
};

const UsersPage = () => {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}>
      <div className="overflow-x-auto">
        <ErrorBoundary>
          <Suspense fallback={<LoadingPage />}>
            <UsersListPage />
          </Suspense>
        </ErrorBoundary>
      </div>
    </RoleGuard>
  );
};

export default UsersPage;
