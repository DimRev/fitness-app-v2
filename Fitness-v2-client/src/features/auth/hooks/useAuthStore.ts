import { create } from "zustand";

type AuthState = {
  user: AuthUser | null;
};

type AuthActions = {
  setUser: (user: AuthUser | null) => void;
};

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
