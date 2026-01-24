import { MiniPlayer } from "@/components/MiniPlayer";
import { RecentlyPlayedCard } from "@/components/RecentlyPlayedCard";
import { SongListItem } from "@/components/SongListItem";
import { TabFilter } from "@/components/TabFilter";
import { AppColors } from "@/constants/theme";
import { Song } from "@/constants/types";
import useAudioContext from "@/hooks/store/audioContext";
import useHistory from "@/hooks/store/history";
import usePlaylist from "@/hooks/store/playlist";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyState from "../EmptyState";
// Helper function to format duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
const TABS = [
  { id: "songs", label: "Songs" },
  { id: "playlists", label: "Playlists" },
];

interface LibraryScreenProps {
  onSettingsPress?: () => void;
  onSongPress?: (song: Song) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  onSettingsPress,
  onSongPress,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("songs");
  const currentSong = useRef<Song>(null);
  const playlists = usePlaylist((state) => state.playlists);
  const history = useHistory((state) => state.history);
  const setSong = useAudioContext((state) => state.setSong);
  const [songs, setSongs] = useState<Song[]>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  console.log(playlists);

  const getSongs = () => {
    if (permissionResponse?.status !== "granted") {
      requestPermission();
    }
    const allSongs = MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
    });
    allSongs.then((res) => {
      const songs = res.assets.map((asset) => ({
        id: asset.id,
        title: asset.filename.replace(/\.[^/.]+$/, ""),
        artist: undefined,
        album: undefined,
        duration: asset.duration,
        cover: undefined,
        url: asset.uri,
      }));
      setSongs(songs);
    });
  };

  useEffect(() => {
    getSongs();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="search" size={24} color={AppColors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onSettingsPress}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={AppColors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <TabFilter
        tabs={TABS}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {activeTab === "songs" ? (
          <>
            <View style={styles.section}>
              {/* Recently Played */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recently Played</Text>
                {/* <TouchableOpacity>
              <Text style={styles.viewAll}>VIEW ALL</Text>
            </TouchableOpacity> */}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentlyPlayedList}
              >
                {history.length > 0 ? (
                  history.map(
                    (item) =>
                      item && (
                        <RecentlyPlayedCard
                          key={item.id}
                          title={item.title}
                          artist={item.artist || ""}
                          coverImage={item.cover || ""}
                          onPress={() => setSong(item)}
                        />
                      ),
                  )
                ) : (
                  <EmptyState />
                )}
              </ScrollView>
            </View>

            <View style={styles.section}>
              {/* All Songs */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Songs</Text>
                {/* <TouchableOpacity style={styles.sortButton}>
              <Ionicons
                name="swap-vertical"
                size={18}
                color={AppColors.accentCyan}
              />
              <Text style={styles.sortText}>SORT</Text>
            </TouchableOpacity> */}
              </View>

              <View>
                
              </View>
            </View>
          </>
        ) : (
          <>
            {playlists &&
              playlists.map((playlist) => (
                <View key={playlist.id} style={styles.playlistSection}>
                  <View style={styles.playlistHeader}>
                    <Text style={styles.playlistName}>{playlist.name}</Text>
                    <Text style={styles.playlistCount}>
                      {playlist.songs.length} songs
                    </Text>
                  </View>
                  {playlist.songs
                    .filter((s): s is NonNullable<Song> => s !== null)
                    .map((song) => (
                      <SongListItem
                        key={song.id}
                        title={song.title}
                        artist={song.artist ?? "Unknown Artist"}
                        duration={formatDuration(song.duration)}
                        albumArt={song.cover}
                        isActive={currentSong.current?.id === song.id}
                        isPlaying={currentSong.current?.id === song.id}
                        onPress={() => onSongPress?.(song)}
                      />
                    ))}
                </View>
              ))}
          </>
        )}
      </ScrollView>

      {/* Mini Player */}
      <View style={styles.miniPlayerContainer}>
        <MiniPlayer showHeart={true} />
      </View>
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
  scrollView: {},
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.accentCyan,
  },
  recentlyPlayedList: {
    paddingHorizontal: 16,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.accentCyan,
  },
  playlistSection: {
    marginBottom: 16,
  },
  playlistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: AppColors.backgroundCard,
    marginHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  playlistCount: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  miniPlayerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 8,
  },
});
