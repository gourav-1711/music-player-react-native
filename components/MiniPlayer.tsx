import { AppColors } from "@/constants/theme";
import useAudioContext from "@/hooks/store/audioContext";
import useFavourite from "@/hooks/store/favourite";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface MiniPlayerProps {
  showHeart?: boolean;
  lightTheme?: boolean;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  showHeart = false,
  lightTheme = false,
}) => {
  const router = useRouter();
  // Get data from audio context
  const song = useAudioContext((state) => state.song);
  const audio = useAudioContext((state) => state.audio);
  const isFavorite = useFavourite((state) =>
    state.songs.find((favSong) => favSong?.id === song?.id),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const favouriteToggle = useFavourite((state) => state.toggleSong);
  const isPlaying = useAudioContext((state) => state.isPlaying);
  const togglePlayPause = useAudioContext((state) => state.setIsPlaying);
  const playlist = useAudioContext((state) => state.playlist);
  const setSong = useAudioContext((state) => state.setSong);
  const bgColor = lightTheme ? "#E8E8F0" : "#1A1A1A";
  const textColor = lightTheme ? AppColors.textLight : AppColors.textPrimary;
  const subtextColor = lightTheme ? "#666" : AppColors.textSecondary;

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

  const onPlayPause = () => {
    const newIsPlaying = !isPlaying;
    togglePlayPause(newIsPlaying); // Update the state
    if (newIsPlaying) {
      audio?.play();
    } else {
      audio?.pause();
    }
  };

  if (!song) {
    return null;
  }
  return (
    <Pressable
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={() => router.push("/playing")}
    >
      <View style={styles.leftSection}>
        {song.cover ? (
          <Image source={{ uri: song.cover }} style={styles.albumArt} />
        ) : (
          <View style={[styles.albumArt, styles.placeholderArt]}>
            <Ionicons
              name="musical-note"
              size={20}
              color={AppColors.accentCyan}
            />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            style={[styles.title, { color: textColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {song.title}
          </Text>
          <Text
            style={[styles.artist, { color: subtextColor }]}
            numberOfLines={1}
          >
            {song.artist ?? "Unknown Artist"}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        {showHeart && (
          <Pressable
            style={styles.controlButton}
            onPress={() => favouriteToggle(song)}
          >
            <Ionicons
              name="heart"
              size={22}
              color={
                isFavorite ? AppColors.accentCyan : AppColors.textSecondary
              }
            />
          </Pressable>
        )}
        <Pressable style={styles.controlButton} onPress={onPlayPause}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={24}
            color={lightTheme ? AppColors.accentCyan : AppColors.textPrimary}
          />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={onNext}>
          <Ionicons
            name="play-skip-forward"
            size={22}
            color={lightTheme ? AppColors.textLight : AppColors.textPrimary}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  placeholderArt: {
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  artist: {
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  controlButton: {
    padding: 8,
  },
});
