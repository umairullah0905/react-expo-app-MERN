import { Image, StyleSheet, Platform } from 'react-native';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import EventListItem from '@/components/EventListItem';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

  // Fetch data on every mount of the component
  const fetchExamContents = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await axios.get('http://192.168.29.145:3000/data/exam'); // Replace with your API endpoint
      setEvents(response.data.examContents); // Assuming response.data.examContents contains the list
    } catch (error) {
      console.error('Error fetching exam contents:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching is done
    }
  };

  // Fetch data every time the component is mounted
  useEffect(() => {
    fetchExamContents(); // Fetch exam contents each time the component mounts
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  // Handle the pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExamContents(); // Fetch data again on refresh
    setRefreshing(false); // Set refreshing to false once done
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <GestureHandlerRootView>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={events} // Render fetched events
            renderItem={({ item }) => <EventListItem event={item} />}
            keyExtractor={(item) => item._id} // Ensure _id is unique
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh} // Trigger the refresh on pull down
              />
            }
            ListEmptyComponent={loading ? <Text>Loading...</Text> : <Text>No events found</Text>} // Show loading message or empty state
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
});
