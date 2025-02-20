import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios"; // Import Axios
import { useAuth } from "../context/AuthContext";
import { Link, useRouter } from "expo-router";
interface user {
  _id: string,
  username: string;
  role: string;
}
export default function AdminScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
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


  // Render admin screen with form
  return (
    <View style={styles.container}>
      {user?.role === "admin" ? (
        <>
          <Text style={styles.welcomeText}>Welcome, Admin!</Text>
          
          {/* Display Username */}
          <Text style={styles.usernameText}>Username: {user?.username}</Text>

          {/* Navigation to Home Screen */}
          <Link href="/" style={styles.link}>
            Go to Home Screen
          </Link>

          {/* Navigation to AdminForm */}
          <View style={styles.buttonContainer}>
            <Button
              title="Go to Admin Form"
              onPress={() => {
                // Replace `/admin-form` with the correct route for the AdminForm component
                router.replace("/admin/AdminForm");
              }}
              color="#F9C0AB"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Logout" onPress={logout} color="#F4E0AF" />
          </View>
        </>
      ) : (
        <Text style={styles.redirectText}>Redirecting...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E0AF",
    padding: 20,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F9C0AB",
    marginBottom: 20,
    textAlign: "center",
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#355F2E", // Darker amber shade for contrast
    marginBottom: 20,
    textAlign: "center",
  },
  link: {
    fontSize: 16,
    color: "#007BFF", // Blue for contrast
    textDecorationLine: "underline",
    textAlign: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: "hidden", // Ensures button corners match the container
  },
  redirectText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A4A4A", // Neutral gray for readability
    textAlign: "center",
  },
});
