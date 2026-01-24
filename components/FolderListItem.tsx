import { AppColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FolderListItemProps {
  name: string;
  onPress?: () => void;
  onMenuPress?: () => void;
}

export const FolderListItem: React.FC<FolderListItemProps> = ({
  name,
  onPress,
  onMenuPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="folder" size={28} color={AppColors.accentPink} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        
      </View>

      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={AppColors.textSecondary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    color: AppColors.textPrimary,
    fontSize: 15,
    fontWeight: "500",
  },
  description: {
    color: AppColors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  menuButton: {
    padding: 8,
  },
});
