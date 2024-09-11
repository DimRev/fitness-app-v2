import { create } from "zustand";

type UserState = {
  userEditDialogOpen: boolean;
  editingUser: User | null;
};

type UserActions = {
  setUserEditDialogOpen: (open: boolean, editingUser?: User) => void;
};

type UserStore = UserState & UserActions;

const useUserStore = create<UserStore>((set) => ({
  userEditDialogOpen: false,
  setUserEditDialogOpen: (open, editingUser) =>
    set(() => {
      if (!open) {
        return { userEditDialogOpen: false, editingUser: null };
      }
      return { userEditDialogOpen: open, editingUser: editingUser };
    }),
  editingUser: null,
}));

export default useUserStore;
