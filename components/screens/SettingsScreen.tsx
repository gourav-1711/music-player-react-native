import { SettingsListItem } from "@/components/SettingsListItem";
import { AppColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SettingsScreenProps {
  onBackPress?: () => void;
  onScanStorage?: () => void;
  onEqualizerPress?: () => void;
  onAccentColorPress?: () => void;
  onAudioQualityPress?: () => void;
  onSleepTimerPress?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBackPress,
  onScanStorage,
  onEqualizerPress,
  onAccentColorPress,
  onAudioQualityPress,
  onSleepTimerPress,
}) => {
  const insets = useSafeAreaInsets();
  const [amoledMode, setAmoledMode] = useState(true);
  const [gaplessPlayback, setGaplessPlayback] = useState(false);
  const [showHiddenFolders, setShowHiddenFolders] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons
            name="chevron-back"
            size={28}
            color={AppColors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Settings</Text>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Scan Storage Banner */}
        <TouchableOpacity
          style={styles.scanBanner}
          onPress={onScanStorage}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#00F5D4", "#00D4AA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.scanBannerGradient}
          >
            <View style={styles.scanIconContainer}>
              <Ionicons
                name="cube-outline"
                size={24}
                color={AppColors.textLight}
              />
            </View>
            <View style={styles.scanTextContainer}>
              <Text style={styles.scanTitle}>Scan Storage</Text>
              <Text style={styles.scanDescription}>Last scan: 2 days ago</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={AppColors.textLight}
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Appearance Section */}
        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <View style={styles.section}>
          <SettingsListItem
            icon="moon"
            iconColor="#A855F7"
            iconBgColor="#2A1A3A"
            label="AMOLED Mode"
            description="Pure black background"
            type="toggle"
            value={amoledMode}
            onValueChange={setAmoledMode}
          />
          <SettingsListItem
            icon="color-palette"
            iconColor={AppColors.accentCyan}
            iconBgColor="#1A2A2A"
            label="Accent Color"
            type="navigation"
            value={AppColors.accentCyan}
            onPress={onAccentColorPress}
          />
        </View>

        {/* Playback Section */}
        <Text style={styles.sectionTitle}>PLAYBACK</Text>
        <View style={styles.section}>
          <SettingsListItem
            icon="bar-chart"
            iconColor="#22C55E"
            iconBgColor="#1A2A1A"
            label="Audio Quality"
            type="value"
            value="High"
            onPress={onAudioQualityPress}
          />
          <SettingsListItem
            icon="pulse"
            iconColor="#EF4444"
            iconBgColor="#2A1A1A"
            label="Gapless Playback"
            type="toggle"
            value={gaplessPlayback}
            onValueChange={setGaplessPlayback}
          />
          <SettingsListItem
            icon="timer-outline"
            iconColor="#3B82F6"
            iconBgColor="#1A1A2A"
            label="Sleep Timer"
            type="value"
            value="Off"
            onPress={onSleepTimerPress}
          />
        </View>

        {/* Library Section */}
        <Text style={styles.sectionTitle}>LIBRARY</Text>
        <View style={styles.section}>
          <SettingsListItem
            icon="folder-open"
            iconColor={AppColors.accentPink}
            iconBgColor="#2A1A2A"
            label="Show Hidden Folders"
            type="toggle"
            value={showHiddenFolders}
            onValueChange={setShowHiddenFolders}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  scanBanner: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  scanBannerGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  scanIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scanTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textLight,
  },
  scanDescription: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
  },
});
