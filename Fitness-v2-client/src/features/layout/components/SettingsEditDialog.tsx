import useAuthStore from "~/features/auth/hooks/useAuthStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/features/shared/components/ui/dialog";
import { cn } from "~/lib/utils";
import useLayoutStore from "../hooks/useLayoutStore";
import ErrorDialog from "./ErrorDialog";
import SettingsEditForm from "./SettingsEditForm";

function SettingsEditDialog() {
  const { isDarkMode } = useLayoutStore();
  const { settingsDialogOpen, setSettingsDialogOpen } = useLayoutStore();
  const { user } = useAuthStore();

  if (!user) {
    return (
      <ErrorDialog
        onOpenChange={setSettingsDialogOpen}
        open={settingsDialogOpen}
        errorMessage="You must be logged in to edit your settings."
        errorCode="LO-SED-0"
      />
    );
  }

  return (
    <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
      <DialogContent className={cn(isDarkMode && "dark", "text-foreground")}>
        <DialogTitle>Settings</DialogTitle>
        {user && <SettingsEditForm user={user} />}
        <DialogDescription>Edit your account settings.</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsEditDialog;
