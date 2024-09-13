import { DialogDescription } from "@radix-ui/react-dialog";
import ErrorDialog from "~/features/layout/components/ErrorDialog";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "~/features/shared/components/ui/dialog";
import { cn } from "~/lib/utils";
import useUserStore from "../hooks/useUserStore";
import UserAdminEditForm from "./UserAdminEditForm";

function UserAdminEditDialog() {
  const { userEditDialogOpen, setUserEditDialogOpen, editingUser } =
    useUserStore();

  const { isDarkMode } = useLayoutStore();

  if (!editingUser) {
    return (
      <ErrorDialog
        open={userEditDialogOpen}
        onOpenChange={setUserEditDialogOpen}
        errorCode="U-UAED-0"
        errorMessage="You must be logged in to edit a user."
      />
    );
  }

  return (
    <Dialog open={userEditDialogOpen} onOpenChange={setUserEditDialogOpen}>
      <DialogContent className={cn(isDarkMode && "dark", "text-foreground")}>
        <DialogTitle>Edit User</DialogTitle>
        <UserAdminEditForm user={editingUser} />
        <DialogDescription>
          Edit a user's information, including their username, email, and role.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default UserAdminEditDialog;
