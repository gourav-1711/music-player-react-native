import { MiniPlayer } from "@/components/MiniPlayer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SongListItem } from "@/components/SongListItem";
import { AppColors } from "@/constants/theme";
import { Song } from "@/constants/types";
import useAudioContext from "@/hooks/store/audioContext";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Helper function to format duration from seconds to mm:ss
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function FolderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [albumName, setAlbumName] = useState<string>("");
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [filteredAudioFiles, setFilteredAudioFiles] = useState<
    MediaLibrary.Asset[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentSong = useAudioContext((state) => state.song);
  const setSong = useAudioContext((state) => state.setSong);
  const isPlaying = useAudioContext((state) => state.isPlaying);
  const setPlaylist = useAudioContext((state) => state.setPlaylist);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        setLoading(true);

        const albums = await MediaLibrary.getAlbumsAsync();
        const album = albums.find((a) => a.id === id);
        if (album) {
          setAlbumName(album.title);
        }

        // Get audio files from the album
        const assets = await MediaLibrary.getAssetsAsync({
          album: id,
          mediaType: MediaLibrary.MediaType.audio,
          first: 1000, // Get up to 1000 audio files
        });

        setAudioFiles(assets.assets);
      } catch (error) {
        console.error("Error fetching audio files:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAudioFiles();
    }
  }, [id]);

  const handleBackPress = () => {
    router.back();
  };

  const handleSongPress = (asset: MediaLibrary.Asset) => {
    const song: Song = {
      id: asset.id,
      title: asset.filename.replace(/\.[^/.]+$/, ""), // Remove file extension
      artist: undefined,
      album: albumName,
      duration: asset.duration,
      cover: undefined,
      url: asset.uri,
    };
    setSong(song);
    if (audioFiles.length > 0) {
      const songs: Song[] = audioFiles.map((asset) => ({
        id: asset.id,
        title: asset.filename.replace(/\.[^/.]+$/, ""), // Remove file extension
        artist: undefined,
        album: albumName,
        duration: asset.duration,
        cover: undefined,
        url: asset.uri,
      }));
      setPlaylist(songs);
    }
    router.push("/(tabs)/playing");
  };

  const handleMiniPlayerPress = () => {
    router.push("/(tabs)/playing");
  };

  const handlePlayAll = () => {
    if (audioFiles.length > 0) {
      const songs: Song[] = audioFiles.map((asset) => ({
        id: asset.id,
        title: asset.filename.replace(/\.[^/.]+$/, ""), // Remove file extension
        artist: undefined,
        album: albumName,
        duration: asset.duration,
        cover: undefined,
        url: asset.uri,
      }));
      setPlaylist(songs);
      handleSongPress(audioFiles[0]);
    }
  };

  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      return;
    }
    const timeoutId = setTimeout(async () => {
      const filterAudioFIles = audioFiles.filter((asset) =>
        asset.filename.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredAudioFiles(filterAudioFIles);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const SONGS = searchQuery !== "" ? filteredAudioFiles : audioFiles;

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title={albumName || "Folder"}
        showBackButton
        onBackPress={handleBackPress}
        rightActions={[
          {
            icon: "search",
            onPress: () => setSearchModalVisible(!searchModalVisible),
          },
        ]}
      />
      {searchModalVisible && (
        <View>
          {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: AppColors.textPrimary }}>Search</Text>
              <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
                <Ionicons name="close" size={24} color={AppColors.textPrimary} />
              </TouchableOpacity>
            </View> */}
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              padding: 16,
              backgroundColor: AppColors.backgroundDark,
              color: AppColors.textPrimary,
              borderWidth: 1,
              borderColor: AppColors.backgroundCardLight,
              borderRadius: 8,
              margin: 1,
            }}
            placeholder="Search"
          />
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.playAllButton} onPress={handlePlayAll}>
          <Ionicons name="play" size={18} color={AppColors.backgroundDark} />
          <Text style={styles.playAllText}>Play All</Text>
        </TouchableOpacity>
      </View>

      {/* Song Count */}
      <View style={styles.songCountContainer}>
        <Text style={styles.songCount}>
          {SONGS.length} {SONGS.length === 1 ? "song" : "songs"}
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.accentCyan} />
          <Text style={styles.loadingText}>Loading songs...</Text>
        </View>
      ) : SONGS.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="musical-notes-outline"
            size={64}
            color={AppColors.textSecondary}
          />
          <Text style={styles.emptyText}>No audio files found</Text>
          <Text style={styles.emptySubtext}>
            This folder doesn't contain any audio files
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          {SONGS.map((file) => {
            const isActive = currentSong?.id === file.id;
            return (
              <SongListItem
                key={file.id}
                title={file.filename.replace(/\.[^/.]+$/, "")}
                artist="Unknown Artist"
                duration={formatDuration(file.duration)}
                isPlaying={isActive && isPlaying}
                isActive={isActive}
                onPress={() => handleSongPress(file)}
                onMenuPress={() => {}}
              />
            );
          })}
        </ScrollView>
      )}

      {/* Mini Player */}
      <View style={styles.miniPlayerContainer}>
        <MiniPlayer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.accentCyan,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  playAllText: {
    color: AppColors.backgroundDark,
    fontWeight: "600",
    fontSize: 14,
  },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: AppColors.accentCyan,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  shuffleText: {
    color: AppColors.accentCyan,
    fontWeight: "600",
    fontSize: 14,
  },
  songCountContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  songCount: {
    color: AppColors.textSecondary,
    fontSize: 13,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyText: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    color: AppColors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  miniPlayerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 8,
  },
});
