import UserAdminEditDialog from "~/features/user/components/UserAdminEditDialog";
import SettingsEditDialog from "./SettingsEditDialog";
import ConfirmationDialog from "~/features/shared/components/ConfirmationDialog";
import SupportTicketDialog from "./SupportTicketDialog";

function GlobalDialogs() {
  return (
    <>
      <ConfirmationDialog />
      <UserAdminEditDialog />
      <SettingsEditDialog />
      <SupportTicketDialog />
    </>
  );
}

export default GlobalDialogs;
