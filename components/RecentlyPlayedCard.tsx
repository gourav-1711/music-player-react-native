import { AppColors } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RecentlyPlayedCardProps {
  title: string;
  artist: string;
  coverImage?: string;
  onPress: () => void;
}

export const RecentlyPlayedCard: React.FC<RecentlyPlayedCardProps> = ({
  title,
  artist,
  coverImage,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {coverImage ? (
        <Image source={{ uri: coverImage }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.placeholder]}>
          <Text style={styles.placeholderText}>🎵</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.artist} numberOfLines={1}>
        {artist}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 12,
  },
  cover: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginBottom: 8,
  },
  placeholder: {
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 36,
  },
  title: {
    color: AppColors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  artist: {
    color: AppColors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
