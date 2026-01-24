import { WaveformProgress } from "@/components/WaveformProgress";
import { AppColors } from "@/constants/theme";
import useAudioContext from "@/hooks/store/audioContext";
import useFavourite from "@/hooks/store/favourite";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");
const ARTWORK_SIZE = width - 64;

export const NowPlayingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const [time, setTime] = useState({
    current: 0,
    total: 0,
    progress: 0,
  });
  const playlist = useAudioContext((state) => state.playlist);
  const song = useAudioContext((state) => state.song);
  const setSong = useAudioContext((state) => state.setSong);
  const togglePlayPause = useAudioContext((state) => state.setIsPlaying);
  const isPlaying = useAudioContext((state) => state.isPlaying);
  const isFavorite = useFavourite((state) =>
    state.songs.find((song) => song?.id === song?.id),
  );
  const favouriteToggle = useFavourite((state) => state.toggleSong);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const setAudioPlayer = useAudioContext((state) => state.setAudio);
  const player = useAudioPlayer(song?.url);

  useEffect(() => {
    if (player && song && isPlaying) {
      player.play();
      setTime({
        current: player.currentTime,
        total: player.duration,
        progress: player.currentTime / player.duration,
      });
      player.addListener("playbackStatusUpdate", onPlayBackStatusUpdate);
    }
  }, [player, isPlaying]);

  useEffect(() => {
    setAudioPlayer(player);
  }, [player]);

  const onShuffle = () => {
    setShuffle((prev) => {
      if (!prev) setRepeat(false);
      return !prev;
    });
  };

  const onRepeat = () => {
    setRepeat((prev) => {
      if (!prev) setShuffle(false);
      return !prev;
    });
  };

  const onPlayPause = () => {
    togglePlayPause(!isPlaying);
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    }
  };

  const onPrevious = () => {
    if (!playlist) return;
    if (currentIndex === 0) {
      setCurrentIndex(playlist.length - 1);
      setSong(playlist[playlist.length - 1]);
      return;
    }
    setCurrentIndex((prev) => prev - 1);
    setSong(playlist[currentIndex - 1]);
  };

  const onNext = () => {
    if (!playlist) return;
    if (currentIndex === playlist.length - 1) {
      setCurrentIndex(0);
      setSong(playlist[0]);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSong(playlist[currentIndex + 1]);
  };

  const onClose = () => {
    // TODO: Implement close logic
  };

  const onMenuPress = () => {
    // TODO: Implement menu press logic
  };

  const onPlayBackStatusUpdate = (status: any) => {
    console.log(status);
    setTime({
      current: player.currentTime,
      total: player.duration,
      progress: player.currentTime / player.duration,
    });
    if (status.didJustFinish) {
      if (shuffle) {
        const randomIndex = Math.floor(Math.random() * playlist.length);
        setCurrentIndex(randomIndex);
        setSong(playlist[randomIndex]);
      } else if (repeat) {
        player.seekTo(0);
      } else {
        onNext();
      }
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={onClose}>
          <Ionicons
            name="chevron-down"
            size={28}
            color={AppColors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={onMenuPress}>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={AppColors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Album Artwork */}
      <View style={styles.artworkContainer}>
        {song?.cover ? (
          <Image source={{ uri: song.cover }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.placeholderArt]}>
            <View style={styles.placeholderContent}>
              <View style={styles.synthwaveSun} />
              <View style={styles.synthwaveMountains} />
            </View>
          </View>
        )}
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <View style={styles.songTitleRow}>
          <Text style={styles.songTitle}>{song?.title}</Text>
          <TouchableOpacity onPress={() => favouriteToggle(song)}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={
                isFavorite ? AppColors.accentCyan : AppColors.textSecondary
              }
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.artistName}>{song?.artist}</Text>
      </View>

      {/* Waveform Progress */}
      <View style={styles.progressContainer}>
        <WaveformProgress
          currentTime={time.current}
          totalTime={time.total}
          progress={time.progress}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          disabled={!player}
          style={styles.controlButton}
          onPress={onShuffle}
        >
          <Ionicons
            name="shuffle"
            size={24}
            color={shuffle ? AppColors.accentCyan : AppColors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!player}
          style={styles.controlButton}
          onPress={onPrevious}
        >
          <Ionicons
            name="play-skip-back"
            size={28}
            color={AppColors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!player}
          style={styles.playButton}
          onPress={onPlayPause}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={32}
            color={AppColors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!player}
          style={styles.controlButton}
          onPress={onNext}
        >
          <Ionicons
            name="play-skip-forward"
            size={28}
            color={AppColors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={onRepeat}>
          <Ionicons
            name="repeat"
            size={24}
            color={repeat ? AppColors.accentCyan : AppColors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Tabs */}
      {/* <View style={styles.bottomTabs}>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setActiveBottomTab("lyrics")}
        >
          <Text
            style={[
              styles.bottomTabText,
              activeBottomTab === "lyrics" && styles.bottomTabTextActive,
            ]}
          >
            LYRICS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setActiveBottomTab("related")}
        >
          <Text
            style={[
              styles.bottomTabText,
              activeBottomTab === "related" && styles.bottomTabTextActive,
            ]}
          >
            RELATED
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerButton: {
    padding: 8,
  },
  artworkContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 20,
  },
  placeholderArt: {
    backgroundColor: "#1A1A2E",
    overflow: "hidden",
  },
  placeholderContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  synthwaveSun: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FF69B4",
    opacity: 0.8,
  },
  synthwaveMountains: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    backgroundColor: "#00CED1",
    opacity: 0.3,
  },
  songInfo: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  songTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  songTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary,
  },
  artistName: {
    fontSize: 16,
    color: AppColors.accentCyan,
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 32,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 24,
    marginBottom: 40,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppColors.accentPurple,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: AppColors.accentPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomTabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
  },
  bottomTab: {
    padding: 8,
  },
  bottomTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.textSecondary,
    letterSpacing: 1,
  },
  bottomTabTextActive: {
    color: AppColors.textPrimary,
  },
});
