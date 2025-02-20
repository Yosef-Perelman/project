import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, subDays, parse } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import { useNutritionStore } from '@/hooks/useNutritionStore';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { DateNavigator } from '@/components/DateNavigator';
import { FoodSection } from '@/components/FoodSection';
import { WorkoutSection } from '@/components/WorkoutSection';
import { MoodSection } from '@/components/MoodSection';
import { EditFoodModal } from '@/components/EditFoodModal';

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { theme, colors, toggleTheme } = useTheme();
  const {
    dailyEntry,
    addFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
    updateWorkout,
    updateMood,
  } = useNutritionStore(selectedDate);

  const [newFood, setNewFood] = useState('');
  const [newFoodTime, setNewFoodTime] = useState(format(new Date(), 'HH:mm'));
  const [editingFood, setEditingFood] = useState<{ id: string; name: string; time: string } | null>(null);
  const slideAnim = useSharedValue(0);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = direction === 'next'
      ? addDays(selectedDate, 1)
      : subDays(selectedDate, 1);
    setSelectedDate(newDate);
    slideAnim.value = withSpring(direction === 'next' ? 20 : -20, {}, () => {
      slideAnim.value = withSpring(0);
    });
  };

  const handleAddFood = () => {
    if (newFood.trim()) {
      addFoodEntry({
        name: newFood.trim(),
        time: newFoodTime, // Now we can use the time string directly
      });
      setNewFood('');
    }
  };

  const handleUpdateFood = () => {
    if (editingFood?.name.trim()) {
      try {
        const timeString = editingFood.time.includes('T') 
          ? editingFood.time.split('T')[1].substring(0, 5) 
          : editingFood.time;
        
        updateFoodEntry(editingFood.id, {
          name: editingFood.name.trim(),
          time: timeString, // Just store the time string directly
        });
        setEditingFood(null);
      } catch (error) {
        console.error('Invalid time format');
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }],
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingBottom: 80, // Add padding to avoid content being hidden by theme toggle
    },
    themeToggle: {
      position: 'absolute',
      bottom: 20,  // Changed from top to bottom
      right: 20,
      zIndex: 1,
      padding: 8,
      backgroundColor: colors.card,
      borderRadius: 20,
    },
    foodItem: {
      flexDirection: 'row',
      justifyContent: 'space-between', // This will push items to opposite ends
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    foodName: {
      color: colors.text,
      flex: 1,
      marginRight: 10, // Add some space between name and time
    },
    foodTime: {
      color: colors.text,
      minWidth: 60, // Ensure consistent width for time
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <DateNavigator 
          selectedDate={selectedDate}
          onNavigate={navigateDate}
          animatedStyle={animatedStyle}
        />

        <FoodSection
          foods={dailyEntry.foods}
          newFood={newFood}
          newFoodTime={newFoodTime}
          onNewFoodChange={setNewFood}
          onNewFoodTimeChange={setNewFoodTime}
          onAddFood={handleAddFood}
          onEditFood={setEditingFood}
          onDeleteFood={deleteFoodEntry}
          styles={{
            foodItem: styles.foodItem,
            foodName: styles.foodName,
            foodTime: styles.foodTime,
          }}
        />

        <WorkoutSection
          workout={dailyEntry.workout}
          onWorkoutUpdate={updateWorkout}
        />

        <MoodSection
          mood={dailyEntry.mood}
          onMoodUpdate={updateMood}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.themeToggle}
        onPress={toggleTheme}
      >
        <Ionicons
          name={theme === 'dark' ? 'sunny' : 'moon'}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>

      <EditFoodModal
        editingFood={editingFood}
        onClose={() => setEditingFood(null)}
        onUpdate={handleUpdateFood}
        onEditingFoodChange={(text, field) => 
          setEditingFood(prev => prev ? { 
            ...prev, 
            [field]: field === 'time' 
              ? text  // Just use the time string directly instead of converting to ISO
              : text 
          } : null)
        }
      />
    </SafeAreaView>
  );
}