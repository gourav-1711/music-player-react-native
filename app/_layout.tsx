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

import { setupAudio } from "@/constants/audioConfig";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAudioLifecycle } from "@/hooks/useAudioLifecycle";
import { setStyle } from "expo-navigation-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

setupAudio();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loadSongs = useFavourite((state) => state.loadSongs);
  const loadPlaylists = usePlaylist((state) => state.loadData);
  const loadHistory = useHistory((state) => state.loadData);
  const loadFavourite = useFavourite((state) => state.loadSongs);

  // Initialize audio lifecycle listeners
  useAudioLifecycle();

  useEffect(() => {
    loadSongs();
    loadPlaylists();
    loadHistory();
    loadFavourite();
    setStyle("auto");
  }, [loadSongs, loadPlaylists, loadHistory, loadFavourite]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
