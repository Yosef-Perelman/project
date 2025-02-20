import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import { FoodEntry } from '@/types/nutrition';

interface FoodSectionProps {
  foods: FoodEntry[];
  newFood: string;
  newFoodTime: string;
  onNewFoodChange: (text: string) => void;
  onNewFoodTimeChange: (text: string) => void;
  onAddFood: () => void;
  onEditFood: (food: FoodEntry) => void;
  onDeleteFood: (id: string) => void;
  styles?: {
    foodItem?: any;
    foodName?: any;
    foodTime?: any;
  };
}

export function FoodSection({
  foods,
  newFood,
  newFoodTime,
  onNewFoodChange,
  onNewFoodTimeChange,
  onAddFood,
  onEditFood,
  onDeleteFood,
}: FoodSectionProps) {
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
    foodInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    input: {
      flex: 1,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      color: colors.text,
    },
    timeInput: {
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      color: colors.text,
    },
    addButton: {
      padding: 12,
      backgroundColor: colors.primary,
      borderRadius: 8,
      alignItems: 'center',
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    foodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    foodText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Food Entries</Text>
      <View style={styles.foodInputContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          placeholder="Add food entry..."
          placeholderTextColor={colors.text}
          value={newFood}
          onChangeText={onNewFoodChange}
        />
        <TextInput
          style={styles.timeInput}
          placeholder="HH:mm"
          placeholderTextColor={colors.text}
          value={newFoodTime}
          onChangeText={onNewFoodTimeChange}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={onAddFood}>
        <Text style={styles.addButtonText}>Add Food</Text>
      </TouchableOpacity>
      {foods.map(food => (
        <View key={food.id} style={styles.foodItem}>
          <Text style={styles.foodText}>{food.name}</Text>
          <Text style={styles.foodText}>
            {format(new Date(food.time), 'HH:mm')}
          </Text>
          <TouchableOpacity 
            onPress={() => onEditFood(food)}
            style={{ marginRight: 10 }}
          >
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDeleteFood(food.id)}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
} 