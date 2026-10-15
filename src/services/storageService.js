import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@favorite_bus_trips';

/**
 * Load all bus trips from AsyncStorage.
 * @returns {Promise<Array>} Array of bus trips.
 */
export const loadBusTrips = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json !== null) {
      const data = JSON.parse(json);
      return Array.isArray(data) ? data : [];
    }
    return [];
  } catch (error) {
    console.error('Error loading bus trips from AsyncStorage:', error);
    return [];
  }
};

/**
 * Save all bus trips to AsyncStorage.
 * @param {Array} trips Array of bus trips to store.
 */
export const saveBusTrips = async (trips) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error('Error saving bus trips to AsyncStorage:', error);
    throw error;
  }
};

/**
 * Clear all trips from storage (utility function).
 */
export const clearBusTrips = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing bus trips:', error);
  }
};

