import { Song } from "@/constants/types";
import useAudioContext from "@/hooks/store/audioContext";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import EmptyState from "./EmptyState";
import { SongListItem } from "./SongListItem";

interface SongListProps {
  songs: Song[];
  albumName?: string;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  albumName = "unknown",
}) => {
  const currentSong = useAudioContext((state) => state.song);
  const setSong = useAudioContext((state) => state.setSong);
  const isPlaying = useAudioContext((state) => state.isPlaying);
  const setPlaylist = useAudioContext((state) => state.setPlaylist);

  const router = useRouter();

  const handleSongPress = (asset: Song) => {
    const song: Song = {
      id: asset?.id || "",
      title: asset?.title || "", // Remove file extension
      artist: "",
      album: albumName,
      duration: asset?.duration || 0,
      cover: "",
      url: asset?.url || "",
    };
    setSong(song);
    if (songs.length > 0) {
      const songsList: Song[] = songs.map((asset) => ({
        id: asset?.id || "",
        title: asset?.title || "", // Remove file extension
        artist: "",
        album: albumName,
        duration: asset?.duration || 0,
        cover: "",
        url: asset?.url || "",
      }));
      setPlaylist(songsList);
    }
    router.push("/(tabs)/playing");
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderSongItem = ({ item: file }: { item: Song }) => {
    const isActive = currentSong?.id === file?.id;
    if (!file) return null;

    return (
      <SongListItem
        title={file?.title}
        artist="Unknown Artist"
        duration={formatDuration(file.duration)}
        isPlaying={isActive && isPlaying}
        isActive={isActive}
        onPress={() => handleSongPress(file as Song)}
        onMenuPress={() => {}}
        song={file}
      />
    );
  };

  if (!songs || songs.length === 0) {
    return <EmptyState />;
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item?.id || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default SongList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 0,
  },
});
