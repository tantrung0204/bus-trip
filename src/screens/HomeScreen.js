import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTrips } from '../context/TripContext';

export default function HomeScreen({ navigation }) {
  const { trips, loading } = useTrips();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e55039" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const isVisited = item.visited;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isVisited ? styles.cardVisited : styles.cardUnvisited,
        ]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('DetailTrip', { tripId: item.id })}
      >
        <View style={styles.iconContainer}>
          {isVisited ? (
            <Ionicons name="checkmark-circle" size={30} color="#2e7d32" />
          ) : (
            <Ionicons name="bus" size={30} color="#e53935" />
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.busNumber}>{item.busNumber}</Text>
          <Text style={styles.route}>{item.route}</Text>
          <Text style={styles.operator}>{item.operator}</Text>
          <Text style={styles.rating}>
            Rating: {item.rating} <Text style={styles.star}>⭐</Text>
          </Text>
          <Text
            style={[
              styles.status,
              isVisited ? styles.statusVisited : styles.statusUnvisited,
            ]}
          >
            {isVisited ? 'Visited' : 'Unvisited'}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.bannerIcon}
          resizeMode="contain"
        />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Favorite Bus Rides</Text>
          <Text style={styles.bannerSubtitle}>Manage your favorite trips</Text>
        </View>
      </View>

      {/* Trips List */}
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={
          trips.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Ionicons name="bus-outline" size={60} color="#bbb" />
            <Text style={styles.emptyText}>
              No bus trips added yet, tap + to add one!
            </Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddTrip')}
      >
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    backgroundColor: '#ff7043',
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    marginRight: 14,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#ffe0b2',
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyView: {
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardVisited: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  cardUnvisited: {
    backgroundColor: '#fff5f2',
    borderColor: '#ff8a80',
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  busNumber: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 2,
  },
  route: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 2,
  },
  operator: {
    fontSize: 13,
    color: '#616161',
    marginBottom: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e64a19',
    marginBottom: 2,
  },
  star: {
    fontSize: 13,
  },
  status: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusVisited: {
    color: '#2e7d32',
  },
  statusUnvisited: {
    color: '#c62828',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ff5722',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});

