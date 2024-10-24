import { Info } from "lucide-react";
import { Helmet } from "react-helmet";
import DashboardPageWrapper from "./DashboardPageWrapper";
import SupportTicketAdminTable from "~/features/support/components/SupportTicketAdminTable";

function AdminSupportTicketPage() {
  return (
    <>
      <Helmet>
        <title>Admin - Support Tickets</title>
      </Helmet>
      <DashboardPageWrapper
        title="Support Tickets"
        LucideIcon={Info}
        to="/admin/support_ticket"
      >
        <SupportTicketAdminTable />
      </DashboardPageWrapper>
    </>
  );
}

export default AdminSupportTicketPage;
