import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { DailyEntry, FoodEntry, WorkoutEntry, MoodEntry } from '@/types/nutrition';
import { format } from 'date-fns';

const STORAGE_KEY = 'nutrition_data';

export function useNutritionStore(date: Date) {
  const [dailyEntry, setDailyEntry] = useState<DailyEntry>({
    date: format(date, 'yyyy-MM-dd'),
    foods: [],
    workout: { completed: false, description: '' },
    mood: { rating: 5, description: '' },
  });

  useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const entries: Record<string, DailyEntry> = JSON.parse(data);
        const dateKey = format(date, 'yyyy-MM-dd');
        if (entries[dateKey]) {
          setDailyEntry(entries[dateKey]);
        } else {
          setDailyEntry({
            date: dateKey,
            foods: [],
            workout: { completed: false, description: '' },
            mood: { rating: 5, description: '' },
          });
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (newEntry: DailyEntry) => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const entries: Record<string, DailyEntry> = data ? JSON.parse(data) : {};
      entries[newEntry.date] = newEntry;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addFoodEntry = async (food: Omit<FoodEntry, 'id' | 'createdAt'>) => {
    const newEntry = {
      ...dailyEntry,
      foods: [
        ...dailyEntry.foods,
        {
          ...food,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        },
      ],
    };
    setDailyEntry(newEntry);
    await saveData(newEntry);
  };

  const updateFoodEntry = async (id: string, food: Partial<FoodEntry>) => {
    const newEntry = {
      ...dailyEntry,
      foods: dailyEntry.foods.map(f =>
        f.id === id ? { ...f, ...food } : f
      ),
    };
    setDailyEntry(newEntry);
    await saveData(newEntry);
  };

  const deleteFoodEntry = async (id: string) => {
    const newEntry = {
      ...dailyEntry,
      foods: dailyEntry.foods.filter(f => f.id !== id),
    };
    setDailyEntry(newEntry);
    await saveData(newEntry);
  };

  const updateWorkout = async (workout: WorkoutEntry) => {
    const newEntry = { ...dailyEntry, workout };
    setDailyEntry(newEntry);
    await saveData(newEntry);
  };

  const updateMood = async (mood: MoodEntry) => {
    const newEntry = { ...dailyEntry, mood };
    setDailyEntry(newEntry);
    await saveData(newEntry);
  };

  return {
    dailyEntry,
    addFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
    updateWorkout,
    updateMood,
  };
}