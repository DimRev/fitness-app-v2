import { LineChart } from "lucide-react";
import UsersTable from "~/features/user/components/UsersTable";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { Dialog, DialogTrigger } from "~/features/shared/components/ui/dialog";
import { Button } from "~/features/shared/components/ui/button";
import { DialogContent } from "@radix-ui/react-dialog";

function AdminUserPage() {
  return (
    <DashboardPageWrapper title="Users" LucideIcon={LineChart} to="/admin/user">
      <UsersTable />
    </DashboardPageWrapper>
  );
}

export default AdminUserPage;
