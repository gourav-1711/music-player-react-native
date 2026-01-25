import { Song } from "@/constants/types";
import { AudioPlayer } from "expo-audio";
import { create } from "zustand";
import { getData } from "../data";
import history from "./history";

type audioData = {
  song: Song;
  isPlaying: boolean;
  playlist: Song[];
  audio: AudioPlayer | null;
};

type audioContextState = {
  song: Song;
  isPlaying: boolean;
  playlist: Song[];
  audio: AudioPlayer | null;
  setSong: (song: Song) => void;
  clearSong: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayback: () => void;
  setPlaylist: (playlist: Song[]) => void;
  setAudio: (audio: AudioPlayer) => void;
  loadData: () => void;
};
const KEY = "audioContext";

const useAudioContext = create<audioContextState>((set, get) => ({
  song: null as Song,
  isPlaying: false,
  playlist: [],
  audio: null,
  setSong: (song: Song) => {
    set({ song, isPlaying: true });
    history.getState().setHistory(song);
  },
  clearSong: () => set({ song: null, isPlaying: false }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaylist: (playlist: Song[]) => set({ playlist }),
  setAudio: (audio: AudioPlayer) => set({ audio }),
  loadData: () => {
    getData<audioData>(KEY).then((data) => {
      if (data) {
        set({
          song: data.song,
          isPlaying: data.isPlaying,
          playlist: data.playlist,
          audio: data.audio,
        });
      }
    });
  },
}));

export default useAudioContext;
