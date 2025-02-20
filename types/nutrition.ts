export interface FoodEntry {
  id: string;
  name: string;
  time: string;
  createdAt: string;
}

export interface WorkoutEntry {
  completed: boolean;
  description: string;
}

export interface MoodEntry {
  rating: number;
  description: string;
}

export interface DailyEntry {
  date: string;
  foods: FoodEntry[];
  workout: WorkoutEntry;
  mood: MoodEntry;
}