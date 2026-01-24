import { AppColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
}) => {
  const bgColor = isActive
    ? lightTheme
      ? "#F0E6F5"
      : "rgba(168, 85, 247, 0.15)"
    : "transparent";
  const textColor = lightTheme ? AppColors.textLight : AppColors.textPrimary;
  const subtextColor = lightTheme ? "#666" : AppColors.textSecondary;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
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
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Ionicons name="ellipsis-vertical" size={18} color={subtextColor} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
});
