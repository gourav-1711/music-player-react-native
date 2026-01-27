import { registerRootComponent } from "expo";
import TrackPlayer from "react-native-track-player";
import { PlaybackService } from "./hooks/trackPlayerServices";

// Import the Expo Router App component (generated automatically)
// @ts-ignore - expo-router/entry doesn't have type definitions
import App from "expo-router/entry";

// Register the Track Player playback service
TrackPlayer.registerPlaybackService(() => PlaybackService);

// Register the root component (Expo Router)
registerRootComponent(App);
