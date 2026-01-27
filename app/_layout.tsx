import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import useFavourite from "@/hooks/store/favourite";
import useHistory from "@/hooks/store/history";
import usePlaylist from "@/hooks/store/playlist";
import { setupPlayer, updateOptions } from "@/hooks/trackPlayerServices";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setStyle } from "expo-navigation-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loadSongs = useFavourite((state) => state.loadSongs);
  const loadPlaylists = usePlaylist((state) => state.loadData);
  const loadHistory = useHistory((state) => state.loadData);
  const loadFavourite = useFavourite((state) => state.loadSongs);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  async function setup() {
    const isSetup = await setupPlayer();
    if (isSetup) {
      await updateOptions();
      setIsPlayerReady(true);
    }
  }

  useEffect(() => {
    loadSongs();
    loadPlaylists();
    loadHistory();
    loadFavourite();
    setStyle("auto");
    setup();
  }, []);

  if (!isPlayerReady) {
    return <View>loading...</View>;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" hidden={true} />
        </PaperProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
