import { SearchInput } from "@/app/(tabs)/folders/[id]";
import { MiniPlayer } from "@/components/MiniPlayer";
import { RecentlyPlayedCard } from "@/components/RecentlyPlayedCard";
import { TabFilter } from "@/components/TabFilter";
import { AppColors } from "@/constants/theme";
import { Song } from "@/constants/types";
import useAudioContext from "@/hooks/store/audioContext";
import useHistory from "@/hooks/store/history";
import usePlaylist from "@/hooks/store/playlist";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyState from "../EmptyState";
import SongList from "../SongList";

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
  const playlists = usePlaylist((state) => state.playlists);
  const history = useHistory((state) => state.history);
  const clearHistory = useHistory((state) => state.clearHistory);
  const setSong = useAudioContext((state) => state.setSong);
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [visible, setVisible] = useState(false);

  const getSongs = () => {
    if (permissionResponse?.status !== "granted") {
      requestPermission();
    }
    const allSongs = MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 200,
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
          <Pressable
            style={styles.actionButton}
            onPress={() => setSearchModalVisible(!searchModalVisible)}
          >
            <Ionicons name="search" size={24} color={AppColors.textPrimary} />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onSettingsPress}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={AppColors.textPrimary}
            />
          </Pressable>
        </View>
      </View>
      {searchModalVisible && (
        <SearchInput searchQuery={search} setSearchQuery={setSearch} />
      )}

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
                <Pressable>
                  <Text style={styles.viewAll} onPress={() => setVisible(true)}>
                    Clear
                  </Text>
                </Pressable>
              </View>

              <Portal>
                <Modal
                  visible={visible}
                  onDismiss={() => setVisible(false)}
                  contentContainerStyle={styles.containerStyle}
                >
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Ionicons
                        name="warning-outline"
                        size={48}
                        color={AppColors.accentPink}
                      />
                      <Text style={styles.modalTitle}>Clear History?</Text>
                      <Text style={styles.modalDescription}>
                        This will remove all recently played songs from your
                        history. This action cannot be undone.
                      </Text>
                    </View>

                    <View style={styles.modalActions}>
                      <Pressable
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => setVisible(false)}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </Pressable>

                      <Pressable
                        style={[styles.modalButton, styles.deleteButton]}
                        disabled={history.length === 0}
                        onPress={() => {
                          clearHistory();
                          setVisible(false);
                        }}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </Portal>
              <FlatList
                data={history}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentlyPlayedList}
                ListEmptyComponent={<EmptyState />}
                keyExtractor={(item) => item?.id || Math.random().toString()}
                renderItem={({ item }) =>
                  item && (
                    <RecentlyPlayedCard
                      title={item.title}
                      artist={item.artist || ""}
                      coverImage={item.cover || ""}
                      onPress={() => setSong(item)}
                    />
                  )
                }
              />
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

              <SongList songs={songs} />
            </View>
          </>
        ) : (
          <>
            <FlatList
              data={playlists}
              keyExtractor={(playlist) => playlist.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: playlist }) => (
                <View style={styles.playlistSection}>
                  <View style={styles.playlistHeader}>
                    <Text style={styles.playlistName}>{playlist.name}</Text>
                    <Text style={styles.playlistCount}>
                      {playlist.songs.length} songs
                    </Text>
                  </View>
                  <SongList songs={playlist.songs} />
                </View>
              )}
            />
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
  containerStyle: {
    backgroundColor: AppColors.backgroundCard,
    width: "90%",
    margin: "auto",
    borderRadius: 20,
    padding: 24,
  },
  modalContent: {
    gap: 24,
  },
  modalHeader: {
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: AppColors.backgroundDark,
    borderWidth: 1,
    borderColor: AppColors.accentCyan,
  },
  deleteButton: {
    backgroundColor: AppColors.accentPink,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.accentCyan,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
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
