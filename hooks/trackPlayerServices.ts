import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
} from "react-native-track-player";

/**
 * Setup the Track Player with initial configuration
 */
export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getActiveTrack();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    isSetup = true;
  } finally {
    return isSetup;
  }
}

/**
 * Add tracks to the player queue
 */
export async function addTracks() {
  // This function was originally used to add example tracks.
  // Since we are loading tracks dynamically or don't have the sample assets,
  // we leave this empty to prevent errors with missing files.
  // await TrackPlayer.add([
  //   {
  //     id: "1",
  //     url: require("../assets/audio/sample.mp3"),
  //     title: "Sample Track",
  //     artist: "Sample Artist",
  //     artwork: require("../assets/images/artwork.png"),
  //     duration: 0,
  //   },
  // ]);
}

/**
 * Configure player capabilities and options
 */
export async function updateOptions() {
  await TrackPlayer.updateOptions({
    // Whether the player should stop running when the app is closed
    android: {
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
    },
    // Media controls capabilities
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
      Capability.Stop,
    ],
    // Capabilities that will show up when the notification is in the compact form on Android
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    // Icons for the notification on Android (if you want custom ones)
    // notificationCapabilities: [Capability.Play, Capability.Pause],
    progressUpdateEventInterval: 1, // Update progress every 1 second
  });
}

/**
 * Playback Service - handles remote events like play, pause, skip, etc.
 * This must be registered separately (see index.js)
 */
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    TrackPlayer.seekTo(position);
  });

  // Handle playback queue ended
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, ({ position }) => {
    console.log("Playback queue ended at position:", position);
  });

  // Handle errors
  TrackPlayer.addEventListener(Event.PlaybackError, (event) => {
    console.error("Playback error:", event);
  });
}
