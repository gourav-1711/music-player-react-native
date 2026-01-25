import { AppColors } from "@/constants/theme";
import { Song } from "@/constants/types";
import usePlaylist from "@/hooks/store/playlist";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Checkbox, Menu, Modal, Portal } from "react-native-paper";

interface SongListItemProps {
  title: string;
  artist: string;
  albumArt?: string;
  duration?: string;
  isPlaying?: boolean;
  isActive?: boolean;
  onPress: () => void;
  onMenuPress?: () => void;
  lightTheme?: boolean;
  song?: Song;
}

export const SongListItem: React.FC<SongListItemProps> = ({
  title,
  artist,
  albumArt,
  duration,
  isPlaying = false,
  isActive = false,
  onPress,
  onMenuPress,
  lightTheme = false,
  song,
}) => {
  // State management
  const [menuVisible, setMenuVisible] = useState(false);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  // Playlist store
  const playlists = usePlaylist((state) => state.playlists);
  const setPlaylists = usePlaylist((state) => state.setPlaylists);

  // Colors
  const bgColor = isActive
    ? lightTheme
      ? "#F0E6F5"
      : "rgba(168, 85, 247, 0.15)"
    : "transparent";
  const textColor = lightTheme ? AppColors.textLight : AppColors.textPrimary;
  const subtextColor = lightTheme ? "#666" : AppColors.textSecondary;

  // Handlers
  const handleAddCoverImage = () => {
    setMenuVisible(false);
    // TODO: Implement cover image picker
    console.log("Add cover image - placeholder");
  };

  const handleAddToPlaylist = () => {
    setMenuVisible(false);
    setPlaylistModalVisible(true);
  };

  const handlePlaylistToggle = (playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId],
    );
  };

  const handleAddToPlaylists = () => {
    if (!song) return;
    console.log("hello");

    const updatedPlaylists = playlists.map((playlist) => {
      if (selectedPlaylists.includes(playlist.id)) {
        // Check if song already exists in playlist
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
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      {albumArt ? (
        <Image source={{ uri: albumArt }} style={styles.albumArt} />
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
          style={[
            styles.title,
            { color: isActive ? AppColors.accentPurple : textColor },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={[styles.artist, { color: subtextColor }]}
          numberOfLines={1}
        >
          {artist}
        </Text>
      </View>

      <View style={styles.rightSection}>
        {isPlaying && (
          <Ionicons name="bar-chart" size={18} color={AppColors.accentPurple} />
        )}
        {duration && (
          <Text style={[styles.duration, { color: subtextColor }]}>
            {duration}
          </Text>
        )}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Pressable
              style={styles.menuButton}
              onPress={() => {
                setMenuVisible(true);
                onMenuPress?.();
              }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={18}
                color={subtextColor}
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
      </View>

      {/* Playlist Selection Modal */}
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  placeholderArt: {
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
  },
  artist: {
    fontSize: 13,
    marginTop: 3,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  duration: {
    fontSize: 13,
  },
  menuButton: {
    padding: 4,
  },
  // Menu styles
  menuContent: {
    backgroundColor: AppColors.backgroundCard,
    borderRadius: 12,
  },
  menuItemTitle: {
    color: AppColors.textPrimary,
    fontSize: 14,
  },
  // Playlist Modal styles
  playlistModalContainer: {
    backgroundColor: AppColors.backgroundCard,
    width: "90%",
    maxHeight: "70%",
    margin: "auto",
    borderRadius: 20,
    padding: 24,
  },
  playlistModalContent: {
    gap: 20,
  },
  playlistModalHeader: {
    alignItems: "center",
    gap: 12,
  },
  playlistModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    textAlign: "center",
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
    paddingHorizontal: 16,
    backgroundColor: AppColors.backgroundDark,
    borderRadius: 12,
    marginBottom: 8,
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
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  playlistModalActions: {
    flexDirection: "row",
    gap: 12,
  },
  playlistModalButton: {
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
