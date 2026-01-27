import { AppColors } from "@/constants/theme";
import { Song } from "@/constants/types";
import usePlaylist from "@/hooks/store/playlist";
import { useImagePicker } from "@/hooks/useImagePicker";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Checkbox, Menu, Modal, Portal } from "react-native-paper";

interface SongActionsMenuProps {
  song?: Song;
  menuIconColor?: string;
}

const SongActionsMenuComponent: React.FC<SongActionsMenuProps> = ({
  song,
  menuIconColor = AppColors.textSecondary,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  const playlists = usePlaylist((state) => state.playlists);
  const setPlaylists = usePlaylist((state) => state.setPlaylists);
  
  const { pickImageForSong } = useImagePicker();

  const handleAddCoverImage = useCallback(async () => {
    setMenuVisible(false);
    if (!song?.id) return;

    await pickImageForSong(song.id);
  }, [song?.id, pickImageForSong]);

  const handleAddToPlaylist = useCallback(() => {
    setMenuVisible(false);
    setPlaylistModalVisible(true);
  }, []);

  const handlePlaylistToggle = useCallback((playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId],
    );
  }, []);

  const handleAddToPlaylists = useCallback(() => {
    if (!song) return;

    const updatedPlaylists = playlists.map((playlist) => {
      if (selectedPlaylists.includes(playlist.id)) {
        const songExists = playlist.songs.some((s) => s?.id === song.id);
        if (!songExists) {
          return {
            ...playlist,
            songs: [...playlist.songs, song],
          };
        }
      }
      return playlist;
    });

    setPlaylists(updatedPlaylists);
    setSelectedPlaylists([]);
    setPlaylistModalVisible(false);
  }, [song, playlists, selectedPlaylists, setPlaylists]);

  return (
    <>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Pressable
            style={styles.menuButton}
            onPress={() => {
              setMenuVisible(true);
            }}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={18}
              color={menuIconColor}
            />
          </Pressable>
        }
        contentStyle={styles.menuContent}
      >
        <Menu.Item
          onPress={handleAddCoverImage}
          title="Add Cover Image"
          leadingIcon={() => (
            <Ionicons
              name="image-outline"
              size={20}
              color={AppColors.textPrimary}
            />
          )}
          titleStyle={styles.menuItemTitle}
        />
        <Menu.Item
          onPress={handleAddToPlaylist}
          title="Add to Playlist"
          leadingIcon={() => (
            <Ionicons name="list" size={20} color={AppColors.textPrimary} />
          )}
          titleStyle={styles.menuItemTitle}
        />
      </Menu>

      <Portal>
        <Modal
          visible={playlistModalVisible}
          onDismiss={() => {
            setPlaylistModalVisible(false);
            setSelectedPlaylists([]);
          }}
          contentContainerStyle={styles.playlistModalContainer}
        >
          <View style={styles.playlistModalContent}>
            <View style={styles.playlistModalHeader}>
              <Ionicons name="list" size={32} color={AppColors.accentCyan} />
              <Text style={styles.playlistModalTitle}>Add to Playlist</Text>
              <Text style={styles.playlistModalDescription}>
                Select playlists to add this song to
              </Text>
            </View>

            <FlatList
              data={playlists}
              style={styles.playlistList}
              keyExtractor={(playlist) => playlist.id}
              renderItem={({ item: playlist }) => (
                <Pressable
                  style={styles.playlistItem}
                  onPress={() => handlePlaylistToggle(playlist.id)}
                >
                  <View style={styles.playlistItemContent}>
                    <Text style={styles.playlistName}>{playlist.name}</Text>
                    <Text style={styles.playlistSongCount}>
                      {playlist.songs.length} songs
                    </Text>
                  </View>
                  <Checkbox
                    status={
                      selectedPlaylists.includes(playlist.id)
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => handlePlaylistToggle(playlist.id)}
                    color={AppColors.accentCyan}
                  />
                </Pressable>
              )}
            />

            <View style={styles.playlistModalActions}>
              <Pressable
                style={[styles.playlistModalButton, styles.cancelButton]}
                onPress={() => {
                  setPlaylistModalVisible(false);
                  setSelectedPlaylists([]);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.playlistModalButton, styles.addButton]}
                disabled={selectedPlaylists.length === 0}
                onPress={handleAddToPlaylists}
              >
                <Text style={styles.addButtonText}>
                  Add to {selectedPlaylists.length} playlist
                  {selectedPlaylists.length !== 1 ? "s" : ""}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
  },
  menuContent: {
    backgroundColor: AppColors.backgroundCard,
    borderRadius: 12,
  },
  menuItemTitle: {
    color: AppColors.textPrimary,
    fontSize: 15,
  },
  playlistModalContainer: {
    backgroundColor: AppColors.backgroundCard,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    maxHeight: "80%",
  },
  playlistModalContent: {
    gap: 20,
  },
  playlistModalHeader: {
    alignItems: "center",
    gap: 8,
  },
  playlistModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  playlistModalDescription: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: "center",
  },
  playlistList: {
    maxHeight: 300,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  playlistItemContent: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "500",
    color: AppColors.textPrimary,
  },
  playlistSongCount: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  playlistModalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  playlistModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: AppColors.accentCyan,
  },
  addButton: {
    backgroundColor: AppColors.accentCyan,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.accentCyan,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
});

// Memoize component to prevent unnecessary re-renders
export const SongActionsMenu = React.memo(SongActionsMenuComponent);
SongActionsMenu.displayName = "SongActionsMenu";
