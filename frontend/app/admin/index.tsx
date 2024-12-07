import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios"; // Import Axios
import { useAuth } from "../context/AuthContext";
import { Link } from "expo-router";

export default function AdminScreen() {
  const { user, logout } = useAuth();

  // Form state for handling input
  const [examTitle, setExamTitle] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [preparationLink, setPreparationLink] = useState("");
  const [books, setBooks] = useState("");
  const [category, setCategory] = useState("");
  const [examType, setExamType] = useState("");
  const [examApplicationLink, setExamApplicationLink] = useState("");
  const [image, setImage] = useState("");
  const [events, setEvents] = useState([]); // State to store events

  // Fetch the latest exam data
  const fetchExamContents = async () => {
    try {
      const response = await axios.get('http://192.168.29.145:3000/data/exam'); // API endpoint to get exam data
      setEvents(response.data.examContents); // Update the events state with new data
    } catch (error) {
      console.error("Error fetching exam contents:", error);
    }
  };

  // Handle the form submission with Axios POST request
  const handleSubmit = async () => {
    if (!examTitle || !registrationDate || !preparationLink || !books || !category || !examType || !examApplicationLink) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.29.145:3000/api/exam/${user?.username}`, // Endpoint URL with username
        {
          examTitle,
          registrationDate,
          preparationLink,
          books,
          category,
          examType,
          examApplicationLink,
          image, // Optional field
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle response
      if (response.status === 201) {
        Alert.alert("Success", response.data.message);
        fetchExamContents(); // Fetch latest exam content data after successful POST request
      } else {
        Alert.alert("Error", response.data.message || "Failed to create exam content");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // Render admin screen with form
  return (
    <View style={{ padding: 20 }}>
      {user?.role === "admin" ? (
        <>
          <Text>Welcome, Admin!</Text>

          {/* Exam Form */}
          <View style={{ marginVertical: 20 }}>
            <Text>Exam Title</Text>
            <TextInput
              value={examTitle}
              onChangeText={setExamTitle}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Text>Registration Date</Text>
            <TextInput
              value={registrationDate}
              onChangeText={setRegistrationDate}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Text>Preparation Link</Text>
            <TextInput
              value={preparationLink}
              onChangeText={setPreparationLink}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Text>Books</Text>
            <TextInput
              value={books}
              onChangeText={setBooks}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Text>Category</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Text>Exam Type</Text>
            <TextInput
              value={examType}
              onChangeText={setExamType}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Text>Exam Application Link</Text>
            <TextInput
              value={examApplicationLink}
              onChangeText={setExamApplicationLink}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Text>Image (URL)</Text>
            <TextInput
              value={image}
              onChangeText={setImage}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Button title="Submit Exam Content" onPress={handleSubmit} />
          </View>

          <Button title="Logout" onPress={logout} />
          <Link href="/" style={{ marginTop: 20, color: "blue", textDecorationLine: "underline" }}>
            Go to Home Screen
          </Link>
        </>
      ) : (
        <Text>Redirecting...</Text>
      )}
    </View>
  );
}
