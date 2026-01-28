import { AudioPro, AudioProContentType } from "react-native-audio-pro";

// Configure audio settings
AudioPro.configure({
  contentType: AudioProContentType.MUSIC,
  debug: true,
  debugIncludesProgress: false,
  progressIntervalMs: 1000,
  showNextPrevControls: true, 
});

// Set up event listeners that persist for the app's lifetime
// Note: We'll handle actual playback logic in stores/components,
// this is just for initial configuration and global listeners if needed.
// For now we keep it minimal.
export const setupAudio = () => {
  // Placeholder for any global setup logic
  console.log("AudioPro initialized");
};
