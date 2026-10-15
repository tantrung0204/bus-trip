import React, { createContext, useState, useEffect, useContext } from 'react';
import { loadBusTrips, saveBusTrips } from '../services/storageService';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load trips from AsyncStorage on mount
  useEffect(() => {
    const fetchTrips = async () => {
      const storedTrips = await loadBusTrips();
      setTrips(storedTrips);
      setLoading(false);
    };
    fetchTrips();
  }, []);

  /**
   * Add a new bus trip.
   * id is auto-generated, visited defaults to false.
   */
  const addTrip = async ({ busNumber, route, operator, rating }) => {
    const newTrip = {
      id: Date.now(), // Unique integer identifier
      busNumber: busNumber.trim(),
      route: route.trim(),
      operator: operator.trim(),
      rating: parseInt(rating, 10),
      visited: false,
    };

    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    await saveBusTrips(updatedTrips);
    return newTrip;
  };

  /**
   * Update an existing bus trip.
   */
  const updateTrip = async (id, { busNumber, route, operator, rating }) => {
    const updatedTrips = trips.map((trip) => {
      if (trip.id === id) {
        return {
          ...trip,
          busNumber: busNumber.trim(),
          route: route.trim(),
          operator: operator.trim(),
          rating: parseInt(rating, 10),
        };
      }
      return trip;
    });

    setTrips(updatedTrips);
    await saveBusTrips(updatedTrips);
  };

  /**
   * Toggle the visited status of a trip.
   */
  const toggleVisited = async (id) => {
    let nextStatus = false;
    const updatedTrips = trips.map((trip) => {
      if (trip.id === id) {
        nextStatus = !trip.visited;
        return {
          ...trip,
          visited: nextStatus,
        };
      }
      return trip;
    });

    setTrips(updatedTrips);
    await saveBusTrips(updatedTrips);
    return nextStatus;
  };

  /**
   * Delete a bus trip by id.
   */
  const deleteTrip = async (id) => {
    const updatedTrips = trips.filter((trip) => trip.id !== id);
    setTrips(updatedTrips);
    await saveBusTrips(updatedTrips);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        loading,
        addTrip,
        updateTrip,
        toggleVisited,
        deleteTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => useContext(TripContext);

