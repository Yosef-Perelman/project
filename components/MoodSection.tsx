import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MoodEntry } from '@/types/nutrition';
import { useLanguage } from '@/context/LanguageContext';

interface MoodSectionProps {
  mood: MoodEntry;
  onMoodUpdate: (mood: MoodEntry) => void;
}

export function MoodSection({ mood, onMoodUpdate }: MoodSectionProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const styles = StyleSheet.create({
    section: {
      marginBottom: 4,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 10,
    },
    moodContainer: {
      alignItems: 'center',
    },
    moodRatingRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 4,
    },
    moodButton: {
      width: 40,  // Increased from 32
      height: 40, // Increased from 32
      borderRadius: 20, // Half of width/height
      justifyContent: 'center',
      alignItems: 'center',
      margin: 4,
    },
    moodButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 18,  // Added font size
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      marginBottom: 8,
    },
  });

  const firstRowRatings = [1, 2, 3, 4, 5];
  const secondRowRatings = [6, 7, 8, 9, 10];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('mood')}</Text>
      <View style={styles.moodContainer}>
        <View>
          <View style={styles.moodRatingRow}>
            {firstRowRatings.map(rating => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.moodButton,
                  {
                    backgroundColor:
                      rating === mood.rating
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() => onMoodUpdate({ ...mood, rating })}>
                <Text style={styles.moodButtonText}>{rating}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.moodRatingRow}>
            {secondRowRatings.map(rating => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.moodButton,
                  {
                    backgroundColor:
                      rating === mood.rating
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() => onMoodUpdate({ ...mood, rating })}>
                <Text style={styles.moodButtonText}>{rating}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput
          style={[styles.input, { width: '100%' }]}
          placeholder={t('moodPlaceholder')}
          placeholderTextColor={colors.text}
          value={mood.description}
          onChangeText={text =>
            onMoodUpdate({ ...mood, description: text })
          }
          multiline
        />
      </View>
    </View>
  );
}