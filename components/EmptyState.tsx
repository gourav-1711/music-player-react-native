import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme'

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.noHistoryText}>No history found</Text>
    </View>
  )
}

export default EmptyState

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noHistoryText: {
        fontSize: 12,
        fontWeight: "600",
        color: AppColors.textSecondary,
    }
})