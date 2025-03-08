import { RoleGuard } from "@/src/components/auth/role-guard";
import AddUserForm from "../_components/AddUserForm";
import { Separator } from "@/src/components/ui/separator";
import { UserRole } from "@prisma/client";
import PageContainer from "../../../_components/page-container";
import { Heading } from "@/src/components/heading";

export const metadata = {
  title: "Dashboard : Add User",
};

export default async function AddUserPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}>
      <PageContainer>
        <div className="space-y-6">
          <div>
            <Heading
              title="Add New User"
              description="Create a new user account"
            />
          </div>
          <Separator />
          <AddUserForm />
        </div>
      </PageContainer>
    </RoleGuard>
  );
}
