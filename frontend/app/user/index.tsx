import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  Button, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl 
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";


import {BASE_URL} from '../constant';

interface Exam {
  _id: string;
  username: string;
  examTitle: string;
  registrationDate: string;
  preparationLink: string;
  books: string[];
  category: string;
  examType: string;
  examApplicationLink: string;
  image?: string;
}

export default function AdminScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [myInterests, setMyInterests] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInterests = useCallback(async () => {
    try {
      setLoading(!refreshing); // Show the loader only on initial load, not during refresh
      const response = await fetch(`http://${BASE_URL}:8080/api/user/${user?.id}/myInterests`);
      const data = await response.json();

      if (response.ok) {
        setMyInterests(data.exams as Exam[]); // Explicitly cast the response to Exam[]
      } else {
        console.error("Failed to fetch interests:", data.message);
      }
    } catch (error) {
      console.error("Error fetching interests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, refreshing]);

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInterests();
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {myInterests.length > 0 ? (
            myInterests.map((exam, index) => (
              <View
                key={exam._id}
                style={{
                  marginBottom: 20,
                  padding: 15,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 10,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {index + 1}. {exam.examTitle}
                </Text>
                <Text>Username: {exam.username}</Text>
                <Text>Category: {exam.category}</Text>
                <Text>Exam Type: {exam.examType}</Text>
                <Text>Registration Date: {exam.registrationDate}</Text>
                <Text>Preparation Link: {exam.preparationLink}</Text>
                <Text>Books: {exam.books.join(", ")}</Text>
                <Text>Application Link: {exam.examApplicationLink}</Text>
                {exam.image && <Text>Image: {exam.image}</Text>}
              </View>
            ))
          ) : (
            <Text>No interests found!</Text>
          )}
          <Button title="Logout" onPress={logout} />
        </>
      )}
    </ScrollView>
  );
}
