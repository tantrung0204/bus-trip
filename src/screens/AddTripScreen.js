import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTrips } from '../context/TripContext';

export default function AddTripScreen({ navigation }) {
  const { addTrip } = useTrips();

  const [busNumber, setBusNumber] = useState('');
  const [route, setRoute] = useState('');
  const [operator, setOperator] = useState('');
  const [rating, setRating] = useState('');

  const handleSave = async () => {
    const trimmedBus = busNumber.trim();
    const trimmedRoute = route.trim();
    const trimmedOperator = operator.trim();
    const parsedRating = parseInt(rating, 10);

    // Validation: all fields required, rating must be integer 1 to 5
    if (
      !trimmedBus ||
      !trimmedRoute ||
      !trimmedOperator ||
      isNaN(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      Alert.alert(
        'Error',
        'Please enter all information correctly (rating 1-5).'
      );
      return;
    }

    try {
      await addTrip({
        busNumber: trimmedBus,
        route: trimmedRoute,
        operator: trimmedOperator,
        rating: parsedRating,
      });

      Alert.alert('Success', 'Place has been added!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save bus trip. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Top Bar with Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color="#ffffff" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Bus Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. FUTA-01"
              placeholderTextColor="#aaa"
              value={busNumber}
              onChangeText={setBusNumber}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Route *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ho Chi Minh City - Can Tho"
              placeholderTextColor="#aaa"
              value={route}
              onChangeText={setRoute}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Bus Operator *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Phuong Trang"
              placeholderTextColor="#aaa"
              value={operator}
              onChangeText={setOperator}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Rating (1-5) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 5"
              placeholderTextColor="#aaa"
              keyboardType="number-pad"
              value={rating}
              onChangeText={setRating}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={handleSave}
          >
            <Ionicons
              name="save-outline"
              size={20}
              color="#ffffff"
              style={styles.btnIcon}
            />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 12,
  },
  topBar: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333333',
    backgroundColor: '#ffffff',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff5722',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  btnIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

