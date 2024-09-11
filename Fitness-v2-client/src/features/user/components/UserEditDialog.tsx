import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "~/features/shared/components/ui/dialog";
import useUserStore from "../hooks/useUserStore";
import UserEditForm from "./UserEditForm";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { cn } from "~/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";

function UserEditDialog() {
  const { userEditDialogOpen, setUserEditDialogOpen, editingUser } =
    useUserStore();

  const { isDarkMode } = useLayoutStore();

  if (!editingUser) {
    return <></>;
  }

  return (
    <Dialog open={userEditDialogOpen} onOpenChange={setUserEditDialogOpen}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent className={cn(isDarkMode && "dark", "text-foreground")}>
        <UserEditForm user={editingUser} />
      </DialogContent>
      <DialogDescription>
        Edit a user's information, including their username, email, and role.
      </DialogDescription>
    </Dialog>
  );
}

export default UserEditDialog;
