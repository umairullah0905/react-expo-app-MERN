import { Image, StyleSheet, Platform, Button, TouchableOpacity} from 'react-native';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import EventListItem from '@/components/EventListItem';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const API_BASE_URL = process.env.API_BASE_URL;

import {BASE_URL} from '../constant';
// Define the type for exam content
type ExamContent = {
  _id: string;
  username: string;
  examTitle: string;
  registrationDate: string;
  preparationLink: string;
  books: string[];
  category: string;
  examType: string;
  examApplicationLink: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export default function HomeScreen() {
  const [events, setEvents] = useState<ExamContent[]>([]); // State for the fetched data
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [refreshing, setRefreshing] = useState<boolean>(false); // Refreshing state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<ExamContent[]>([]); // State for filtered data

  // Fetch data from the API
  const fetchExamContents = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await axios.get(`http://${BASE_URL}:8080/data/exam`); // Replace with your API endpoint
      const fetchedEvents = response.data.examContents;
      setEvents(fetchedEvents); // Store all events
      setFilteredEvents(fetchedEvents); // Initially show all events
    } catch (error) {
      console.error('Error fetching exam contents:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching is done
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchExamContents(); // Fetch exam contents each time the component mounts
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  // Handle the pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExamContents(); // Fetch data again on refresh
    setRefreshing(false); // Set refreshing to false once done
  }, []);

  // Filter events by category
  const filterByCategory = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      const filtered = events.filter((event) => event.category === category);
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events); // Show all events if no category is selected
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <GestureHandlerRootView>
        <SafeAreaView style={styles.container}>
          {/* Category Filter Buttons */}
          <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[
      styles.categoryButton,
      selectedCategory === null && styles.selectedButton,
    ]}
    onPress={() => filterByCategory(null)}
  >
    <Text style={styles.buttonText}>All</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[
      styles.categoryButton,
      selectedCategory === 'Engineering' && styles.selectedButton,
    ]}
    onPress={() => filterByCategory('Engineering')}
  >
    <Text style={styles.buttonText}>Engineering</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[
      styles.categoryButton,
      selectedCategory === 'MBA' && styles.selectedButton,
    ]}
    onPress={() => filterByCategory('MBA')}
  >
    <Text style={styles.buttonText}>MBA</Text>
  </TouchableOpacity>
</View>

          {/* Event List */}
          <FlatList
            data={filteredEvents} // Pass the filtered data
            renderItem={({ item }) => <EventListItem event={item} />}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              loading ? <Text>Loading...</Text> : <Text>No events found</Text>
            }
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: '#F9C0AB',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#F4E0AF',
  },
  selectedButton: {
    backgroundColor: '#F4E0AF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
