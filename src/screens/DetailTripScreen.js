import React, { useState, useEffect } from 'react';
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

export default function DetailTripScreen({ route, navigation }) {
  const { tripId } = route.params || {};
  const { trips, updateTrip, toggleVisited, deleteTrip } = useTrips();

  const currentTrip = trips.find((t) => t.id === tripId);

  const [busNumber, setBusNumber] = useState('');
  const [routeText, setRouteText] = useState('');
  const [operator, setOperator] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    if (currentTrip) {
      setBusNumber(currentTrip.busNumber);
      setRouteText(currentTrip.route);
      setOperator(currentTrip.operator);
      setRating(currentTrip.rating.toString());
    }
  }, [currentTrip]);

  if (!currentTrip) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.notFoundText}>Bus trip not found.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={18} color="#ffffff" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Handle Update
  const handleUpdate = async () => {
    const trimmedBus = busNumber.trim();
    const trimmedRoute = routeText.trim();
    const trimmedOperator = operator.trim();
    const parsedRating = parseInt(rating, 10);

    // Validation
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
      await updateTrip(currentTrip.id, {
        busNumber: trimmedBus,
        route: trimmedRoute,
        operator: trimmedOperator,
        rating: parsedRating,
      });

      Alert.alert('Success', 'Bus trip information updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update bus trip.');
    }
  };

  // Handle Toggle Visited
  const handleToggleVisited = async () => {
    try {
      const nextStatus = await toggleVisited(currentTrip.id);
      const msg = nextStatus
        ? 'Bus trip marked as Visited!'
        : 'Bus trip marked as Unvisited!';
      Alert.alert('Success', msg);
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle visited status.');
    }
  };

  // Handle Delete with Confirmation Dialog
  const handleDelete = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this bus trip?',
      [
        {
          text: 'CANCEL',
          style: 'cancel',
        },
        {
          text: 'DELETE',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrip(currentTrip.id);
              Alert.alert('Success', 'Bus trip deleted!', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete bus trip.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Top Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color="#ffffff" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Read-only ID field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>ID (readonly)</Text>
            <TextInput
              style={[styles.input, styles.readonlyInput]}
              value={currentTrip.id.toString()}
              editable={false}
            />
          </View>

          {/* Editable Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Bus Number *</Text>
            <TextInput
              style={styles.input}
              value={busNumber}
              onChangeText={setBusNumber}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Route *</Text>
            <TextInput
              style={styles.input}
              value={routeText}
              onChangeText={setRouteText}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Bus Operator *</Text>
            <TextInput
              style={styles.input}
              value={operator}
              onChangeText={setOperator}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Rating (1-5) *</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={rating}
              onChangeText={setRating}
            />
          </View>

          {/* Trip Status */}
          <View style={styles.statusGroup}>
            <Text style={styles.label}>Trip Status:</Text>
            <Text
              style={[
                styles.statusText,
                currentTrip.visited
                  ? styles.statusTextVisited
                  : styles.statusTextUnvisited,
              ]}
            >
              {currentTrip.visited ? 'Visited' : 'Unvisited'}
            </Text>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.updateBtn]}
              onPress={handleUpdate}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color="#ffffff"
                style={styles.actionIcon}
              />
              <Text style={styles.btnText}>Update Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.toggleBtn]}
              onPress={handleToggleVisited}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#ffffff"
                style={styles.actionIcon}
              />
              <Text style={styles.btnText}>
                {currentTrip.visited ? 'Mark Unvisited' : 'Mark Visited'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={handleDelete}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color="#ffffff"
                style={styles.actionIcon}
              />
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  topBar: {
    marginBottom: 18,
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
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 6,
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
  readonlyInput: {
    backgroundColor: '#f1f3f5',
    color: '#6c757d',
  },
  statusGroup: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusTextVisited: {
    color: '#2e7d32',
  },
  statusTextUnvisited: {
    color: '#c62828',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  updateBtn: {
    backgroundColor: '#ff5722',
  },
  toggleBtn: {
    backgroundColor: '#ff5722',
  },
  deleteBtn: {
    backgroundColor: '#d32f2f',
  },
  actionIcon: {
    marginRight: 4,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

