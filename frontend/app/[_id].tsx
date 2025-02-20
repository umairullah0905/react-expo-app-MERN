import { useLocalSearchParams, Stack } from 'expo-router';
import { Text, View, Pressable, ActivityIndicator, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import axios from 'axios';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useAuth } from './context/AuthContext';
import {BASE_URL} from './constant';
// Define the Event interface
interface Event {
  _id: string;
  username: string;
  examTitle: string;
  examDate: string;
  registrationDate: string;
  preparationLink: string;
  books: string[];
  category: string;
  examType: string;
  examApplicationLink: string;
  image: string;
  description: string;
}

export default function EventPage() {
  const { _id } = useLocalSearchParams(); // Extract the event ID from URL
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null); // State for event data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error message

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Make GET request to fetch event data by event ID
        const response = await axios.get(`http://${BASE_URL}:8080/data/exam/${_id}`);
        setEvent(response.data); // Set the fetched event data
      } catch (err) {
        setError('Error fetching event details'); // Set error message if request fails
        console.error(err);
      } finally {
        setLoading(false); // Stop loading after the request completes
      }
    };

    fetchEvent();
  }, [_id]); // Run this effect when event ID changes

  const handleAddToMyInterests = async () => {
    if (!user || !event) {
      Alert.alert('Error', 'User or Event not found.');
      return;
    }

    try {
      const response = await axios.post(
        `http://${BASE_URL}:8080/api/exam/${user.id}/examid/${event._id}`,
        {} // If your endpoint requires a body, add it here
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Exam added to your interests!');
      } else {
        Alert.alert('Error', 'Failed to add exam to your interests.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while adding the exam.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Event Details" }} />

      {/* Event Title */}
      <Text style={styles.title}>{event.examTitle}</Text>

      {/* Event Category */}
      <Text style={styles.category}>{event.category}</Text>

      {/* Event Organizer */}
      <Text style={styles.detail}>
        <Text style={styles.label}>Posted By: </Text>
        {event.username}
      </Text>

      {/* Event Dates */}
      <Text style={styles.detail}>
        <Text style={styles.label}>Exam Date: </Text>
        {dayjs(event.examDate).format("dddd, MMM D YYYY")}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.label}>Registration Closes: </Text>
        {dayjs(event.registrationDate).format("dddd, MMM D YYYY")}
      </Text>

      {/* Exam Type */}
      <Text style={styles.detail}>
        <Text style={styles.label}>Exam Type: </Text>
        {event.examType}
      </Text>

      {/* Books */}
      <Text style={styles.detail}>
        <Text style={styles.label}>Recommended Books: </Text>
        {event.books.join(", ")}
      </Text>

      {/* Preparation Link */}
      <Text style={styles.detail}>
        <Text style={styles.label}>Preparation Link: </Text>
        {event.preparationLink}
      </Text>

      {/* Exam Application Link */}
      <Text style={styles.detail}>
        <Text style={styles.label}>Application Link: </Text>
        {event.examApplicationLink}
      </Text>

      {/* Description */}
      <Text style={styles.description}>{event.description}</Text>

      {/* Add to Interests Button */}
      <Button title="Add to My Interests" onPress={handleAddToMyInterests} color="#5C3D2E" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E0AF",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5C3D2E",
    marginBottom: 8,
  },
  category: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8B5E34",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  detail: {
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#8B5E34",
  },
  description: {
    fontSize: 16,
    color: "#4A4A4A",
    marginTop: 16,
    lineHeight: 22,
  },
});
