import { Song } from "@/constants/types";
import { create } from "zustand";
import { getData, storeData } from "../data";

const KEY = "history";

type HistoryState = {
  history: Song[];
  setHistory: (song: Song) => void;
  clearHistory: () => void;
  loadData: () => void;
};
export default create<HistoryState>((set) => ({
  history: [],
  setHistory: (song: Song) =>
    set((state) => {
      const filtered = state.history.filter((s) => s?.id !== song?.id);
      const newHistory = [song, ...filtered];
      storeData(newHistory, KEY);
      return { history: newHistory };
    }),

  clearHistory: () => {
    set({ history: [] });
    storeData([], KEY);
  },
  loadData: () => {
    getData<Song[]>(KEY).then((data) => {
      if (data) {
        set({ history: data });
      }
    });
  },
}));
