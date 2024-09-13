import { create } from "zustand";

type LayoutState = {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  settingsDialogOpen: boolean;
};

type LayoutActions = {
  setIsSidebarOpen: () => void;
  setIsDarkMode: (newIsDarkMode: boolean) => void;
  setSettingsDialogOpen: (open: boolean) => void;
};

type LayoutStore = LayoutState & LayoutActions;

const useLayoutStore = create<LayoutStore>((set) => ({
  isSidebarOpen: true,
  isDarkMode: false,
  settingsDialogOpen: false,
  setIsSidebarOpen: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setIsDarkMode: (newIsDarkMode) => {
    const currentConfig = localStorage.getItem("fitness_app_config");
    if (currentConfig) {
      const layoutConfig = JSON.parse(currentConfig) as LayoutConfig;
      localStorage.setItem(
        "fitness_app_config",
        JSON.stringify({ ...layoutConfig, isDarkMode: newIsDarkMode }),
      );
    } else {
      localStorage.setItem(
        "fitness_app_config",
        JSON.stringify({ isDarkMode: newIsDarkMode }),
      );
    }
    return set(() => ({ isDarkMode: newIsDarkMode }));
  },
  setSettingsDialogOpen(open) {
    set(() => ({ settingsDialogOpen: open }));
  },
}));

export default useLayoutStore;
