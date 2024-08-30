import { create } from "zustand";

type LayoutState = {
  isSidebarOpen: boolean;
};

type LayoutActions = {
  setIsSidebarOpen: () => void;
};

type LayoutStore = LayoutState & LayoutActions;

const useLayoutStore = create<LayoutStore>((set) => ({
  isSidebarOpen: true,
  setIsSidebarOpen: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useLayoutStore;
