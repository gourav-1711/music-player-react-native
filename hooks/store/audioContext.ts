import { Song } from "@/constants/types";
import { getSongCover } from "@/utils/imageUtils";
import { AudioPro } from "react-native-audio-pro";
import { create } from "zustand";
import { getData } from "../data";
import history from "./history";
import { useSettingsStore } from "./settingsStore";

type audioData = {
  song: Song;
  isPlaying: boolean;
  playlist: Song[];
};

type audioContextState = {
  song: Song;
  isPlaying: boolean;
  playlist: Song[];
  setSong: (song: Song) => void;
  clearSong: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayback: () => void;
  setPlaylist: (playlist: Song[]) => void;
  loadData: () => void;
  shuffle: boolean;
  repeat: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNext: (forceSkip?: boolean) => void;
  playPrevious: () => void;
};
const KEY = "audioContext";

const useAudioContext = create<audioContextState>((set, get) => ({
  song: null as Song,
  isPlaying: false,
  playlist: [],
  shuffle: false,
  repeat: false,
  setSong: (song: Song) => {
    // Resolve cover art immediately so UI treats it as the "real" cover
    const resolvedSong = song ? { ...song, cover: getSongCover(song) } : null;

    set({ song: resolvedSong, isPlaying: true });

    // Play the song using AudioPro if song exists
    if (resolvedSong) {
      history.getState().setHistory(resolvedSong);

      AudioPro.play({
        id: resolvedSong.id,
        url: resolvedSong.url,
        title: resolvedSong.title,
        artist: resolvedSong.artist || "unknown",
        artwork: resolvedSong.cover || "",
      });
    }
  },
  clearSong: () => {
    set({ song: null, isPlaying: false });
    AudioPro.stop();
  },
  setIsPlaying: (isPlaying: boolean) => {
    set({ isPlaying });
    if (isPlaying) {
      AudioPro.resume();
    } else {
      AudioPro.pause();
    }
  },
  togglePlayback: () => {
    const isPlaying = !get().isPlaying;
    set({ isPlaying });
    if (isPlaying) {
      AudioPro.resume();
    } else {
      AudioPro.pause();
    }
  },
  setPlaylist: (playlist: Song[]) => set({ playlist }),
  loadData: () => {
    getData<audioData>(KEY).then((data) => {
      const settings = useSettingsStore.getState();

      if (data) {
        set({
          song: data.song,
          isPlaying: data.isPlaying,
          playlist: data.playlist,
        });
      }

      // Apply forced settings
      if (settings.alwaysShuffle) set({ shuffle: true });
      if (settings.alwaysRepeat) set({ repeat: true });
    });
  },
  toggleShuffle: () =>
    set((state) => {
      const shuffle = !state.shuffle;
      return { shuffle, repeat: shuffle ? false : state.repeat };
    }),
  toggleRepeat: () =>
    set((state) => {
      const repeat = !state.repeat;
      return { repeat, shuffle: repeat ? false : state.shuffle };
    }),
  playNext: (forceSkip?: boolean) => {
    const { playlist, shuffle, repeat, song } = get();
    if (!playlist || playlist.length === 0) return;

    let nextIndex = -1;
    const currentIndex = playlist.findIndex((s) => s?.id === song?.id);

    // If Repeat is ON and it's NOT a manual skip, repeat the current song
    if (repeat && !forceSkip) {
      nextIndex = currentIndex;
    } else if (shuffle) {
      // Pick random index different from current
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (playlist.length > 1 && nextIndex === currentIndex);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= playlist.length) {
        if (repeat) {
          nextIndex = 0;
        } else {
          return;
        }
      }
    }

    if (nextIndex >= 0 && nextIndex < playlist.length) {
      get().setSong(playlist[nextIndex]);
    }
  },
  playPrevious: () => {
    const { playlist, song, repeat } = get();
    if (!playlist || playlist.length === 0) return;

    const currentIndex = playlist.findIndex((s) => s?.id === song?.id);
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      if (repeat) {
        prevIndex = playlist.length - 1;
      } else {
        prevIndex = 0; // Or do nothing? Standard behavior usually restarts song or goes to previous.
        // Since we don't have seek-to-start logic nicely separated here yet, let's just go to first song.
      }
    }

    if (prevIndex >= 0 && prevIndex < playlist.length) {
      get().setSong(playlist[prevIndex]);
    }
  },
}));

export default useAudioContext;
