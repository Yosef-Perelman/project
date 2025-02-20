import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';

interface DateNavigatorProps {
  selectedDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
  animatedStyle: any;
}

export function DateNavigator({ selectedDate, onNavigate, animatedStyle }: DateNavigatorProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    dateText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => onNavigate('prev')}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.dateText}>
        {format(selectedDate, 'MMMM d, yyyy')}
      </Text>
      <TouchableOpacity onPress={() => onNavigate('next')}>
        <Ionicons name="chevron-forward" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
} 