import { Separator } from "@/src/components/ui/separator";
import { getAllUsers } from "../../user-action";
import { DataTable } from "../../../../_components/table/data-table";
import { columns } from "./columns";
import { userRoles } from "./data/data";
import { UserRole } from "@prisma/client";
import PageContainer from "@/src/app/(protected)/_components/page-container";
import { Heading } from "@/src/components/heading";

export default async function UsersListPage() {
  const users = await getAllUsers();
  const totalUsers = users.length;
  const bannedUsers = users.filter(
    (user) => user.role === UserRole.BANNED
  ).length;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Total Users (${totalUsers})`}
            description={`Active Users: ${
              totalUsers - bannedUsers
            } | Banned Users: ${bannedUsers}`}
          />
        </div>
        <Separator />
        <div className="relative w-full">
          <div className="overflow-x-auto">
            <DataTable
              data={users}
              columns={columns}
              searchKey="email"
              filterKey="role"
              filterOptions={userRoles}
              searchPlaceholder="Search by email..."
              filterPlaceholder="Filter by role"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
