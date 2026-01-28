import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Custom storage adapter for Zustand
const storage = {
  getItem: async (name: string) => {
    // console.log(name, "has been retrieved");
    return (await AsyncStorage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string) => {
    // console.log(name, "with value", value, "has been saved");
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    // console.log(name, "has been deleted");
    await AsyncStorage.removeItem(name);
  },
};

export interface SettingsState {
  // Appearance
  accentColor: string;
  setAccentColor: (color: string) => void;

  accentPurple: string;
  setAccentPurple: (color: string) => void;

  accentPink: string;
  setAccentPink: (color: string) => void;

  // Playback
  alwaysShuffle: boolean;
  toggleAlwaysShuffle: () => void;

  alwaysRepeat: boolean;
  toggleAlwaysRepeat: () => void;

  autoplayNext: boolean;
  toggleAutoplayNext: () => void;

  showRandomCoverArt: boolean;
  toggleShowRandomCoverArt: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Defaults
      accentColor: "#00F5D4",
      setAccentColor: (color) => set({ accentColor: color }),

      accentPurple: "#A855F7",
      setAccentPurple: (color) => set({ accentPurple: color }),

      accentPink: "#FF1493",
      setAccentPink: (color) => set({ accentPink: color }),

      alwaysShuffle: false,
      toggleAlwaysShuffle: () =>
        set((state) => ({ alwaysShuffle: !state.alwaysShuffle })),

      alwaysRepeat: false,
      toggleAlwaysRepeat: () =>
        set((state) => ({ alwaysRepeat: !state.alwaysRepeat })),

      autoplayNext: true,
      toggleAutoplayNext: () =>
        set((state) => ({ autoplayNext: !state.autoplayNext })),

      showRandomCoverArt: true,
      toggleShowRandomCoverArt: () =>
        set((state) => ({ showRandomCoverArt: !state.showRandomCoverArt })),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);
