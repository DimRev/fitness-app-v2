import { create } from "zustand";

type LayoutState = {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  settingsDialogOpen: boolean;
  isConfirmationDialogOpen: boolean;
  confirmationQuestion: string | null;
  confirmationCallback: (() => void) | null;
};

type LayoutActions = {
  setIsSidebarOpen: () => void;
  setIsDarkMode: (newIsDarkMode: boolean) => void;
  setSettingsDialogOpen: (open: boolean) => void;
  setIsConfirmationDialogOpen: (
    open: boolean,
    confirmationQuestion?: string,
    confirmationCallback?: () => void,
  ) => void;
};

type LayoutStore = LayoutState & LayoutActions;

const useLayoutStore = create<LayoutStore>((set) => ({
  isSidebarOpen: true,
  isDarkMode: false,
  settingsDialogOpen: false,
  isConfirmationDialogOpen: false,
  confirmationCallback: null,
  confirmationQuestion: null,
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
  setIsConfirmationDialogOpen(
    open,
    confirmationQuestion,
    confirmationCallback,
  ) {
    if (!open) {
      return set(() => ({
        isConfirmationDialogOpen: false,
        confirmationQuestion: null,
        confirmationCallback: null,
      }));
    }
    set(() => ({
      isConfirmationDialogOpen: open,
      confirmationQuestion,
      confirmationCallback,
    }));
  },
}));

export default useLayoutStore;
