import { create } from "zustand";

type LayoutState = {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
};

type LayoutActions = {
  setIsSidebarOpen: () => void;
  setIsDarkMode: (newIsDarkMode: boolean) => void;
};

type LayoutStore = LayoutState & LayoutActions;

const useLayoutStore = create<LayoutStore>((set) => ({
  isSidebarOpen: true,
  isDarkMode: false,
  setIsSidebarOpen: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setIsDarkMode: (newIsDarkMode) => set(() => ({ isDarkMode: newIsDarkMode })),
}));

export default useLayoutStore;
