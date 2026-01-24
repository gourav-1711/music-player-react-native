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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import * as NavigationBar from 'expo-navigation-bar';

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loadSongs = useFavourite((state) => state.loadSongs);
  const loadPlaylists = usePlaylist((state) => state.loadData);
  const loadHistory = useHistory((state) => state.loadData);
  const loadFavourite = useFavourite((state) => state.loadSongs);
  // TODO: Uncomment when expo-navigation-bar is properly installed
  useEffect(() => {
    loadSongs();
    loadPlaylists();
    loadHistory();
    loadFavourite();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" hidden={true} />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
