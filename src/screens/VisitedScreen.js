import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTrips } from '../context/TripContext';

export default function VisitedScreen({ navigation }) {
  const { trips, loading } = useTrips();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e55039" />
      </View>
    );
  }

  // Filter visited trips
  const visitedTrips = trips.filter((t) => t.visited === true);
  // Count unvisited trips for comparison
  const unvisitedCount = trips.filter((t) => !t.visited).length;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.card, styles.cardVisited]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('DetailTrip', { tripId: item.id })}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={30} color="#2e7d32" />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.busNumber}>{item.busNumber}</Text>
          <Text style={styles.route}>{item.route}</Text>
          <Text style={styles.operator}>{item.operator}</Text>
          <Text style={styles.rating}>
            Rating: {item.rating} <Text style={styles.star}>⭐</Text>
          </Text>
          <Text style={styles.status}>Visited</Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Visited Trips List */}
      <FlatList
        data={visitedTrips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={
          visitedTrips.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Ionicons name="checkmark-circle-outline" size={60} color="#bbb" />
            <Text style={styles.emptyText}>No visited bus trips yet.</Text>
          </View>
        }
      />

      {/* Footer bar showing total unvisited trips */}
      <View style={styles.footerBar}>
        <Text style={styles.footerText}>
          Total Unvisited Bus Trips: {unvisitedCount}
        </Text>
      </View>
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
  listContent: {
    padding: 16,
    paddingBottom: 20,
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
    color: '#2e7d32',
  },
  footerBar: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
});

