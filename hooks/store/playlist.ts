import { PlaylistObj, Song } from "@/constants/types";
import { create } from "zustand";
import { getData, storeData } from "../data";

type playlistState = {
  playlists: PlaylistObj[];
  createPlaylist: (playlist: PlaylistObj) => void;
  deletePlaylist: (id: string) => void;
  setPlaylists: (playlists: PlaylistObj[]) => void;
  findPlaylist: (songId: string) => PlaylistObj | undefined;
  loadData: () => void;
};

const KEY = "playlist";

const usePlaylist = create<playlistState>((set , get) => ({
  playlists: [
    {
      id: "123",
      name: "Default Playlist",
      songs: [],
    },
  ],
  createPlaylist: (playlist: PlaylistObj) =>
    set((state) => ({
      playlists: [playlist, ...state.playlists],
    })),
  deletePlaylist: (id) => {
    set((state) => {
      const newPlaylists = state.playlists.filter(
        (playlist: PlaylistObj) => playlist.id !== id,
      );
      storeData(newPlaylists, KEY);
      return { playlists: newPlaylists };
    });
  },
  setPlaylists: (playlists: PlaylistObj[]) => {
    set({ playlists });
    storeData(playlists, KEY);
  },
  findPlaylist: (songId: string) => {
    return get().playlists.find((playlist) =>
      playlist.songs.some((song) => song?.id === songId),
    );
  },
  loadData: () => {
    getData<PlaylistObj[]>(KEY).then((playlists) => {
      if (playlists && playlists.length > 0) {
        set({ playlists });
      }
    });
  },
}));

export default usePlaylist;
