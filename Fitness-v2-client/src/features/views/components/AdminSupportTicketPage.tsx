import { Info } from "lucide-react";
import { Helmet } from "react-helmet";
import DashboardPageWrapper from "./DashboardPageWrapper";

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
        <div>This is support ticket page</div>
      </DashboardPageWrapper>
    </>
  );
}

export default AdminSupportTicketPage;
