import { LineChart } from "lucide-react";
import UsersTable from "~/features/user/components/UsersTable";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminUserPage() {
  return (
    <DashboardPageWrapper title="Users" LucideIcon={LineChart} to="/admin/user">
      <UsersTable />
    </DashboardPageWrapper>
  );
}

export default AdminUserPage;
