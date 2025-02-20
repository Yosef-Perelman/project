import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/context/ThemeContext';
import { FoodEntry } from '@/types/nutrition';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();

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
      marginBottom: 8,
      backgroundColor: '#2C2C2E',
      borderRadius: 20,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 8,
      textAlign: 'right',
    },
    foodInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      backgroundColor: '#1C1C1E',
      borderRadius: 16,
      padding: 6,
    },
    input: {
      flex: 1,
      padding: 14,
      color: '#FFFFFF',
      fontSize: 16,
      backgroundColor: 'transparent',
    },
    timeInput: {
      padding: 12,
      backgroundColor: '#3A3A3C',
      borderRadius: 12,
      marginLeft: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    addButton: {
      padding: 16,
      backgroundColor: '#FF9F0A',
      borderRadius: 16,
      alignItems: 'center',
      marginVertical: 16,
      shadowColor: "#FF9F0A",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000000',
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
    foodName: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      textAlign: 'right',
    },
    foodTime: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      minWidth: 80,
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

  // Sort foods by time
  const sortedFoods = [...foods].sort((a, b) => {
    const timeA = a.time;
    const timeB = b.time;
    return timeA.localeCompare(timeB);
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('foodEntries')}</Text>
      <View style={styles.foodInputContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          placeholder={t('addFoodPlaceholder')}
          placeholderTextColor={colors.text}
          value={newFood}
          onChangeText={onNewFoodChange}
        />
        <TouchableOpacity
          style={styles.timeInput}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: colors.text }}>
            {newFoodTime || t('selectTime')}
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
        <Text style={styles.addButtonText}>{t('addFood')}</Text>
      </TouchableOpacity>

      {sortedFoods.map(food => (
        <View key={food.id} style={styles.foodItem}>
          <TouchableOpacity onPress={() => onDeleteFood(food.id)}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => onEditFood(food)}
            style={{ marginRight: 10 }}
          >
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.foodTime}>
            {formatTimeDisplay(food.time)}
          </Text>
          <Text style={styles.foodName}>{food.name}</Text>
        </View>
      ))}
    </View>
  );
}