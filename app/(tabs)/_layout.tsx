import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { theme, colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none'
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nutrition Tracker',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="nutrition" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}