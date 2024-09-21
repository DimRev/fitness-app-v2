import UserAdminEditDialog from "~/features/user/components/UserAdminEditDialog";
import SettingsEditDialog from "./SettingsEditDialog";
import ConfirmationDialog from "~/features/shared/components/ConfirmationDialog";

function GlobalDialogs() {
  return (
    <>
      <ConfirmationDialog />
      <UserAdminEditDialog />
      <SettingsEditDialog />
    </>
  );
}

export default GlobalDialogs;
