import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNutritionStore } from '@/hooks/useNutritionStore';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

export default function StatisticsScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const today = new Date();
  const screenWidth = Dimensions.get('window').width;
  
  // Get all days in current month
  const monthInterval = {
    start: startOfMonth(today),
    end: endOfMonth(today),
  };
  
  const daysInMonth = eachDayOfInterval(monthInterval);
  
  // Create store instances for each day and get mood data
  const moodData = daysInMonth.map(date => {
    const store = useNutritionStore(date);
    return {
      date,
      mood: store.dailyEntry.mood.rating,
    };
  });

  // Prepare data for the chart
  const chartData = {
    labels: moodData.map((data, index) => {
      const date = format(data.date, 'd');
      return parseInt(date) % 5 === 0 ? date : '';
    }),
    datasets: [{
      data: moodData.map(data => data.mood), // Remove artificial min/max points
    }],
  };

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.primary
    },
    paddingRight: 0,
    paddingLeft: 0,
    // Configure Y-axis
    yAxisInterval: 2, // Show every 2 units
    segments: 4, // (10-2)/2 = 4 segments
    formatYLabel: (yLabel: string) => {
      const value = parseInt(yLabel);
      // Still keep the Y-axis labels between 2 and 10 for readability
      return value >= 2 && value <= 10 ? yLabel : '';
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
      width: '100%',
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
      width: '100%',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('statistics')}</Text>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{t('monthlyMood')}</Text>
          <View style={{ alignItems: 'center', width: '100%' }}>
            <LineChart
              data={chartData}
              width={screenWidth * 0.9}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withVerticalLines={false}
              withHorizontalLines={false}
              withDots={false}
              withShadow={false}
              yAxisSuffix=""
              //fromNumber={10}
              //toNumber={2}
              segments={4}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
} 