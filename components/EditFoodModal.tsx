import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';

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
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      width: '100%',
      maxWidth: 400,
    },
    modalText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      marginBottom: 12,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
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
            <Text style={styles.modalText}>Edit Food Entry</Text>
            <TextInput
              style={[styles.input, { width: '100%' }]}
              value={editingFood?.name || ''}
              onChangeText={(text) => onEditingFoodChange(text, 'name')}
              placeholder="Food name"
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
                <Text style={styles.addButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={onUpdate}
              >
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}