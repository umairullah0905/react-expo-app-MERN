import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { Redirect } from "expo-router";

export default function AdminScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Check if the user is not an admin and redirect to user page
  // useEffect(() => {
    if (user?.role !== "user") {
      return <Redirect href="/explore" />; // Redirect to user page if not an admin
    }
  // }, [user, router]);

  return (
    <View>
      {user?.role === "user" ? (
        <>
          <Text>Welcome, user!</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Text>Redirecting...</Text>
      )}
    </View>
  );
}
