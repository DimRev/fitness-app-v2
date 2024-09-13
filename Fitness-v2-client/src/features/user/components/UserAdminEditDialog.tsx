import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "~/features/shared/components/ui/dialog";
import useUserStore from "../hooks/useUserStore";
import UserAdminEditForm from "./UserAdminEditForm";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { cn } from "~/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";

function UserAdminEditDialog() {
  const { userEditDialogOpen, setUserEditDialogOpen, editingUser } =
    useUserStore();

  const { isDarkMode } = useLayoutStore();

  if (!editingUser) {
    return <></>;
  }

  return (
    <Dialog open={userEditDialogOpen} onOpenChange={setUserEditDialogOpen}>
      <DialogContent className={cn(isDarkMode && "dark", "text-foreground")}>
        <DialogTitle>Edit User</DialogTitle>
        <UserAdminEditForm user={editingUser} />
      </DialogContent>
      <DialogDescription>
        Edit a user's information, including their username, email, and role.
      </DialogDescription>
    </Dialog>
  );
}

export default UserAdminEditDialog;
