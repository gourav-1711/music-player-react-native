import { MiniPlayer } from "@/components/MiniPlayer";
import { SongListItem } from "@/components/SongListItem";
import { AppColors } from "@/constants/theme";
import { Song } from "@/constants/types";
import useAudioContext from "@/hooks/store/audioContext";
import useFavourite from "@/hooks/store/favourite";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Helper function to format duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const FavouriteScreen = () => {
  const insets = useSafeAreaInsets();
  const songs = useFavourite((state) => state.songs);
  const currentSong = useAudioContext((state) => state.song);
  const setSong = useAudioContext((state) => state.setSong);
  const isPlaying = useAudioContext((state) => state.isPlaying);
  const clearSongs = useFavourite((state) => state.clearSongs);
  const setPlaylist = useAudioContext((state) => state.setPlaylist);

  const handleSongPress = (song: NonNullable<Song>) => {
    setSong(song);
    setPlaylist(songs);
  };

  // Filter out null songs
  const validSongs = songs.filter(
    (song): song is NonNullable<Song> => song !== null
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Favourites</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => clearSongs()} style={styles.actionButton}>
            <Ionicons name="trash" size={24} color={AppColors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={20} color={AppColors.accentPink} />
          <Text style={styles.statText}>{validSongs.length} songs</Text>
        </View>
      </View>

      {/* Song List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {validSongs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="heart-outline"
              size={64}
              color={AppColors.textSecondary}
            />
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptySubtitle}>
              Songs you mark as favourite will appear here
            </Text>
          </View>
        ) : (
          validSongs.map((song) => (
            <SongListItem
              key={song.id}
              title={song.title}
              artist={song.artist ?? "Unknown Artist"}
              duration={formatDuration(song.duration)}
              albumArt={song.cover}
              isActive={currentSong?.id === song.id}
              isPlaying={currentSong?.id === song.id && isPlaying}
              onPress={() => handleSongPress(song)}
            />
          ))
        )}
      </ScrollView>

      {/* Mini Player */}
      <View style={styles.miniPlayerContainer}>
        <MiniPlayer showHeart={true} />
      </View>
    </View>
  );
};

export default FavouriteScreen;

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
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: AppColors.textPrimary,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  scrollView: {
    flex: 1,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  miniPlayerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 8,
  },
});
