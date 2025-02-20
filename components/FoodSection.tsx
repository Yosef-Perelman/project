import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  styles: customStyles,
}: FoodSectionProps) {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = React.useState(false);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      const adjustedDate = new Date(selectedDate.getTime());
      const timeString = format(adjustedDate, 'HH:mm');
      onNewFoodTimeChange(timeString);
    }
  };

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
      marginBottom: 16,
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
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 8,
    },
    foodText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
  });

  const formatTimeDisplay = (timeString: string) => {
    // If timeString is already in HH:mm format, return it
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
      return timeString;
    }
    // Otherwise, try to parse it as a date
    try {
      const date = new Date(timeString);
      return format(date, 'HH:mm');
    } catch {
      return timeString; // Return original if parsing fails
    }
  };

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
        <TouchableOpacity
          style={styles.timeInput}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: colors.text }}>
            {newFoodTime || 'HH:mm'}
          </Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={new Date(`2000-01-01T${newFoodTime}:00`)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={onAddFood}>
        <Text style={styles.addButtonText}>Add Food</Text>
      </TouchableOpacity>

      {foods.map(food => (
        <View key={food.id} style={styles.foodItem}>
          <Text style={styles.foodText}>{food.name}</Text>
          <Text style={styles.foodText}>
            {formatTimeDisplay(food.time)}
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