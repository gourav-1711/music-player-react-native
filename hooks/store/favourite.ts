import { Song } from "@/constants/types";
import { create } from "zustand";
import { getData, storeData } from "../data";

type favouriteState = {
  songs: Song[];
  loadSongs: () => void;
  toggleSong: (song: Song) => void;
  clearSongs: () => void;
};

const KEY = "favourite_songs";

const useFavourite = create<favouriteState>((set) => ({
  songs: [],
  loadSongs: () => {
    getData<Song[]>(KEY).then((songs) => {
      set({ songs: songs || [] });
    });
  },
  toggleSong: (song: Song) => {
    set((state) => {
      const newSongs = state.songs.some((s) => s?.id === song?.id)
        ? state.songs.filter((s) => s?.id !== song?.id)
        : [song, ...state.songs];
      storeData(newSongs, KEY); // Save the new state to storage
      return { songs: newSongs };
    });
  },
  clearSongs: () => {
    storeData([], KEY);
    set({ songs: [] });
  },
}));

export default useFavourite;
