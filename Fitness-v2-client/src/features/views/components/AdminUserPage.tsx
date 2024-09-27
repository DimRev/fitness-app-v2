import { LineChart } from "lucide-react";
import UsersTable from "~/features/user/components/UsersTable";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { Helmet } from "react-helmet";

function AdminUserPage() {
  return (
    <>
      <Helmet>
        <title>Admin - Users</title>
      </Helmet>
      <DashboardPageWrapper
        title="Users"
        LucideIcon={LineChart}
        to="/admin/user"
      >
        <UsersTable />
      </DashboardPageWrapper>
    </>
  );
}

export default AdminUserPage;
