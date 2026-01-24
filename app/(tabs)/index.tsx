import { LibraryScreen } from "@/components/screens";
import { Song } from "@/constants/types";
import useAudioContext from "@/hooks/store/audioContext";
import { useRouter } from "expo-router";
import React from "react";

export default function LibraryTab() {
  const router = useRouter();
  const setSong = useAudioContext((state) => state.setSong);
  return (
    <LibraryScreen
     
      onSettingsPress={() => {
        router.push("/(tabs)/settings");
      }}
      onSongPress={(song: Song): void => {
        setSong(song);
        router.push("/(tabs)/playing");
      }}
    />
  );
}
