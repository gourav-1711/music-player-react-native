import { MiniPlayer } from "@/components/MiniPlayer";
import { SongListItem } from "@/components/SongListItem";
import { TabFilter } from "@/components/TabFilter";
import { AppColors } from "@/constants/theme";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  { id: "all", label: "All Songs" },
  { id: "playlists", label: "Playlists" },
  { id: "artists", label: "Artists" },
  { id: "albums", label: "Albums" },
];

const SONGS = [
  { id: "1", title: "Blinding Lights", artist: "The Weeknd" },
  { id: "2", title: "Midnight City", artist: "M83" },
  { id: "3", title: "Instant Crush", artist: "Daft Punk" },
  { id: "4", title: "Starboy", artist: "The Weeknd" },
  { id: "5", title: "Levitating", artist: "Dua Lipa" },
  { id: "6", title: "Running Up That Hill", artist: "Kate Bush" },
];

interface SongsScreenProps {
  onSongPress?: (songId: string) => void;
  onMiniPlayerPress?: () => void;
  onSortPress?: () => void;
}

export const SongsScreen: React.FC<SongsScreenProps> = ({
  onSongPress,
  onMiniPlayerPress,
  onSortPress,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("all");
  const [currentSongId, setCurrentSongId] = useState("2");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Songs</Text>
        <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
          <Text style={styles.sortIcon}>A</Text>
          <Text style={styles.sortIconZ}>Z</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <TabFilter
        tabs={TABS}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        variant="chip"
        lightTheme={true}
      />

      {/* Song List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {SONGS.map((song) => (
          <SongListItem
            key={song.id}
            title={song.title}
            artist={song.artist}
            isActive={song.id === currentSongId}
            isPlaying={song.id === currentSongId}
            onPress={() => {
              setCurrentSongId(song.id);
              onSongPress?.(song.id);
            }}
            lightTheme={true}
          />
        ))}
      </ScrollView>

      {/* Mini Player */}
      <View style={styles.miniPlayerContainer}>
        <MiniPlayer onPress={onMiniPlayerPress} lightTheme={true} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: AppColors.textLight,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  sortIcon: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.accentCyan,
  },
  sortIconZ: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.accentCyan,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
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
