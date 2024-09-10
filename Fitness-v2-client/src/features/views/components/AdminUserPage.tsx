import { LineChart } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import UsersTable from "~/features/user/components/UsersTable";

function AdminUserPage() {
  return (
    <DashboardPageWrapper title="Users" LucideIcon={LineChart} to="/admin/user">
      <UsersTable />
    </DashboardPageWrapper>
  );
}

export default AdminUserPage;
