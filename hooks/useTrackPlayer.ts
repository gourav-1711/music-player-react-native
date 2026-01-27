import { Song } from "@/constants/types";
import { useState } from "react";
import TrackPlayer, {
  Event,
  State,
  Track,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";

export const useTrackPlayer = () => {
  const [playerState, setPlayerState] = useState<State>(State.None);
  const progress = useProgress();
  // Listen to player state changes
  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      setPlayerState(event.state);
    }
  });
  const play = async () => {
    await TrackPlayer.play();
  };
  const pause = async () => {
    await TrackPlayer.pause();
  };
  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
  };
  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };
  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };
  const addTrack = async (track: Song) => {
    if(track){
      await TrackPlayer.add(track);
    }
  };
  const reset = async () => {
    await TrackPlayer.reset();
  };
  return {
    playerState,
    progress,
    play,
    pause,
    skipToNext,
    skipToPrevious,
    seekTo,
    addTrack,
    reset,
    isPlaying: playerState === State.Playing,
    isBuffering: playerState === State.Buffering,
    isPaused: playerState === State.Paused,
  };
}; // Your song type
export const convertSongToTrack = (song: Exclude<Song, null>): Track => {
  return {
    id: song.id,
    url: song.url,
    title: song.title,
    artist: song.artist || "Unknown Artist",
    artwork: song.cover,
    duration: song.duration,
    album: song.album,
  };
};
