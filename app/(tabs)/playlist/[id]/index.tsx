import { PlaylistDetailScreen } from "@/components/screens/PlaylistDetailScreen";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

const PlaylistDetailRoute = () => {
  const { id } = useLocalSearchParams();
  const playlistId = typeof id === "string" ? id : "";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PlaylistDetailScreen playlistId={playlistId} />
    </>
  );
};

export default PlaylistDetailRoute;
