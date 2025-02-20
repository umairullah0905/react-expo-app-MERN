import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert,ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import axios from "axios"; // Import Axios
import { useAuth } from "../context/AuthContext";
import { Link } from "expo-router";

import {BASE_URL} from '../constant';

export default function AdminForm(){

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
  const [events, setEvents] = useState([]);
  const API_BASE_URL = process.env.API_BASE_URL;


  const fetchExamContents = async () => {
    try {
      const response = await axios.get(`http://${BASE_URL}:8080/data/exam`); // API endpoint to get exam data
      setEvents(response.data.examContents); // Update the events state with new data
    } catch (error) {
      console.error("Error fetching exam contents:", error);
    }
  };


  const handleSubmit = async () => {
    if (!examTitle || !registrationDate || !preparationLink || !books || !category || !examType || !examApplicationLink) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `http://${BASE_URL}:8080/api/exam/${user?.username}`, // Endpoint URL with username
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : 80} // Adjust offset as needed
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {user?.role === "admin" ? (
          <>
            <Text style={styles.header}>Welcome, Admin!</Text>

            {/* Exam Form */}
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <TextInput
                  value={examTitle}
                  onChangeText={setExamTitle}
                  style={styles.input}
                  placeholder="Exam Title"
                  placeholderTextColor="transparent"
                />
                <Text style={styles.label}>Exam Title</Text>
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  value={registrationDate}
                  onChangeText={setRegistrationDate}
                  style={styles.input}
                  placeholder="Registration Date"
                  placeholderTextColor="transparent"
                />
                <Text style={styles.label}>Registration Date</Text>
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  value={preparationLink}
                  onChangeText={setPreparationLink}
                  style={styles.input}
                  placeholder="Preparation Link"
                  placeholderTextColor="transparent"
                />
                <Text style={styles.label}>Preparation Link</Text>
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  value={books}
                  onChangeText={setBooks}
                  style={styles.input}
                  placeholder="Books"
                  placeholderTextColor="transparent"
                />
                <Text style={styles.label}>Books</Text>
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  value={category}
                  onChangeText={setCategory}
                  style={styles.input}
                  placeholder="Category"
                  placeholderTextColor="transparent"
                />
                <Text style={styles.label}>Category</Text>
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  value={examType}
                  onChangeText={setExamType}
                  style={styles.input}
                  placeholder="Exam Type"
                  placeholderTextColor="transparent"
                />
                <Text style={styles.label}>Exam Type</Text>
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  value={examApplicationLink}
                  onChangeText={setExamApplicationLink}
                  style={styles.input}
                  placeholder="Exam Application Link"
                  placeholderTextColor="transparent"
                />
                <Text style={styles.label}>Exam Application Link</Text>
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  value={image}
                  onChangeText={setImage}
                  style={styles.input}
                  placeholder="Image (URL)"
                  placeholderTextColor="transparent"
                />
                <Text style={styles.label}>Image (URL)</Text>
              </View>

              <Button title="Submit Exam Content" onPress={handleSubmit} />
            </View>

            <Link href="/" style={styles.link}>
              Go to Home Screen
            </Link>
          </>
        ) : (
          <Text>Redirecting...</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    marginVertical: 20,
  },
  formGroup: {
    marginBottom: 20,
    position: "relative",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  label: {
    position: "absolute",
    left: 12,
    top: 15,
    fontSize: 14,
    color: "#666",
    backgroundColor: "white",
    paddingHorizontal: 4,
    transform: [{ translateY: -20 }, { scale: 1 }],
  },
  link: {
    marginTop: 20,
    color: "blue",
    textDecorationLine: "underline",
  },
});