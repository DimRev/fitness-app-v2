import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";

function ConfirmationDialog() {
  const {
    isDarkMode,
    isConfirmationDialogOpen,
    confirmationQuestion,
    confirmationCallback,
    setIsConfirmationDialogOpen,
  } = useLayoutStore();

  function onConfirm() {
    if (confirmationCallback) {
      confirmationCallback();
    }
    setIsConfirmationDialogOpen(false);
  }

  return (
    <Dialog
      open={isConfirmationDialogOpen}
      onOpenChange={setIsConfirmationDialogOpen}
    >
      <DialogContent className={cn(isDarkMode && "dark", "text-foreground")}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription> {confirmationQuestion}</DialogDescription>
        <div className="flex justify-end gap-2">
          <Button variant="constructive" onClick={onConfirm}>
            Yes
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsConfirmationDialogOpen(false)}
          >
            No
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;
