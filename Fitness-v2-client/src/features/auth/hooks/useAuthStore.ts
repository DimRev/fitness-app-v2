import { create } from "zustand";

type AuthState = {
  user: User | null;
};

type AuthActions = {
  setUser: (user: User | null) => void;
};

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
