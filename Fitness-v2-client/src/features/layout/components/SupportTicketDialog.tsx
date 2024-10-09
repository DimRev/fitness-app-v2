import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/features/shared/components/ui/dialog";
import useLayoutStore from "../hooks/useLayoutStore";
import { cn } from "~/lib/utils";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import ErrorDialog from "./ErrorDialog";

function SupportTicketDialog() {
  const { isDarkMode, supportTicketDialogOpen, setSupportTicketDialogOpen } =
    useLayoutStore();
  const { user } = useAuthStore();

  if (!user) {
    return (
      <ErrorDialog
        open={supportTicketDialogOpen}
        onOpenChange={setSupportTicketDialogOpen}
        errorMessage="You must be logged in to edit your settings."
        errorCode="LO-SED-0"
      />
    );
  }

  return (
    <Dialog
      open={supportTicketDialogOpen}
      onOpenChange={setSupportTicketDialogOpen}
    >
      <DialogContent className={cn(isDarkMode && "dark", "text-foreground")}>
        <DialogTitle>Support Ticket</DialogTitle>
        Support ticket dialog
        <DialogDescription>Submit a support ticket.</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default SupportTicketDialog;
