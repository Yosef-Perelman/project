import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { WorkoutEntry } from '@/types/nutrition';

interface WorkoutSectionProps {
  workout: WorkoutEntry;
  onWorkoutUpdate: (workout: WorkoutEntry) => void;
}

export function WorkoutSection({ workout, onWorkoutUpdate }: WorkoutSectionProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    section: {
      marginBottom: 20,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    workoutContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 6,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Workout</Text>
      <View style={styles.workoutContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            const newCompleted = !workout.completed;
            onWorkoutUpdate({
              completed: newCompleted,
              description: newCompleted ? workout.description : '',
            });
          }}>
          {workout.completed && (
            <Ionicons name="checkmark" size={20} color={colors.primary} />
          )}
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Describe your workout..."
          placeholderTextColor={colors.text}
          value={workout.description}
          onChangeText={text =>
            onWorkoutUpdate({ ...workout, description: text })
          }
          editable={workout.completed}
        />
      </View>
    </View>
  );
} 