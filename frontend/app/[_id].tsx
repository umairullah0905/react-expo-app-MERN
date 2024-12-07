import { useLocalSearchParams, Stack } from 'expo-router';
import { Text, View, Pressable, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// Define the Event interface
interface Event {
  _id: string,
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
  const { _id } = useLocalSearchParams(); // Extract the userId from URL

  const [event, setEvent] = useState<Event | null>(null); // State for event data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error message

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Make GET request to fetch event data by userId
        const response = await axios.get(`http://192.168.29.145:3000/data/exam/${_id}`);
        setEvent(response.data); // Set the fetched event data
      } catch (err) {
        setError('Error fetching event details'); // Set error message if request fails
        console.error(err);
      } finally {
        setLoading(false); // Stop loading after the request completes
      }
    };

    fetchEvent();
  }, [_id]); // Run this effect when userId changes

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
    <View className="p-3 gap-3 bg-white flex-1">
      <Stack.Screen options={{ title: 'Event' }} />

      {/* Event Category */}
      <Text className="text-xl font-bold" numberOfLines={2}>
        {event.category}
      </Text>

      {/* Event Dates */}
      <Text className="text-lg font-semibold uppercase text-amber-800">
        {dayjs(event.examDate).format('ddd, D MMM')} - {dayjs(event.registrationDate).format('ddd, D MMM')}
      </Text>

      {/* Event Description */}
      <Text className="text-lg" numberOfLines={2}>
        {event.description}
      </Text>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 pb-10 p-5 border-t-2 border-gray-400">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-semibold">{event.books}</Text>
          <Pressable className="bg-red-500 p-5 px-8 rounded-md">
            <Text className="text-white text-lg font-bold">Join and RSVP</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
