import { useEffect } from "react";
import { AudioPro, AudioProEventType } from "react-native-audio-pro";
import useAudioContext from "./store/audioContext";
import { useSettingsStore } from "./store/settingsStore";

export const useAudioLifecycle = () => {
  const playNext = useAudioContext((state) => state.playNext);
  const playPrevious = useAudioContext((state) => state.playPrevious);

  useEffect(() => {
    console.log("Setting up audio lifecycle listeners");

    // AudioPro uses a single event listener for all events
    const subscription = AudioPro.addEventListener((event) => {
      // console.log("AudioPro Event:", event.type); // Uncomment for debugging
      switch (event.type) {
        case AudioProEventType.TRACK_ENDED:
          console.log("Track ended event received, playing next");
          if (useSettingsStore.getState().autoplayNext) {
            playNext();
          }
          break;
        case AudioProEventType.REMOTE_NEXT:
          console.log("Remote next event received");
          playNext(true);
          break;
        case AudioProEventType.REMOTE_PREV:
          console.log("Remote prev event received");
          playPrevious();
          break;
      }
    });

    return () => {
      subscription.remove();
    };
  }, [playNext, playPrevious]);
};
