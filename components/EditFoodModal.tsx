import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface EditFoodModalProps {
  editingFood: { id: string; name: string; time: string } | null;
  onClose: () => void;
  onUpdate: () => void;
  onEditingFoodChange: (text: string, field: 'name' | 'time') => void;
}

export function EditFoodModal({
  editingFood,
  onClose,
  onUpdate,
  onEditingFoodChange,
}: EditFoodModalProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [showPicker, setShowPicker] = React.useState(false);

  const formatTimeForDisplay = (timeString: string) => {
    try {
      // Extract just the time portion if it's an ISO string
      if (timeString.includes('T')) {
        return timeString.split('T')[1].substring(0, 5);
      }
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      // Add 2 hours to compensate for timezone
      const adjustedDate = new Date(selectedDate.getTime());
      const timeString = format(adjustedDate, 'HH:mm');
      onEditingFoodChange(timeString, 'time');
    }
  };

  const styles = StyleSheet.create({
    modalView: {
      backgroundColor: '#2C2C2E',
      borderRadius: 24,
      padding: 24,
      width: '90%',
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
    },
    modalText: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 24,
    },
    input: {
      backgroundColor: '#1C1C1E',
      borderRadius: 16,
      padding: 16,
      color: '#FFFFFF',
      fontSize: 16,
      marginBottom: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    modalButton: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginHorizontal: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 16,
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={editingFood !== null}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          paddingHorizontal: 20,
        }]}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{t('editFoodEntry')}</Text>
            <TextInput
              style={[styles.input, { width: '100%' }]}
              value={editingFood?.name || ''}
              onChangeText={(text) => onEditingFoodChange(text, 'name')}
              placeholder={t('foodName')}
              placeholderTextColor={colors.text}
            />
            <TouchableOpacity
              style={[styles.input, { width: '100%' }]}
              onPress={() => setShowPicker(true)}
            >
              <Text style={{ color: colors.text }}>
                {editingFood ? formatTimeForDisplay(editingFood.time) : 'Select time'}
              </Text>
            </TouchableOpacity>
            
            {showPicker && (
              <DateTimePicker
                value={editingFood?.time ? 
                  new Date(`2000-01-01T${formatTimeForDisplay(editingFood.time)}:00`) 
                  : new Date()
                }
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.error }]}
                onPress={onClose}
              >
                <Text style={styles.addButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={onUpdate}
              >
                <Text style={styles.addButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}