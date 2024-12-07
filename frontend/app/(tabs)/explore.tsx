import React from 'react';
import { View, Text } from 'react-native';
import AdminScreen from '../admin/index'; // Import the AdminScreen component
import UserScreen from '../user/index'; // Import the UserScreen component
import { useAuth } from '../context/AuthContext'; // Import the auth context

export default function ExploreScreen() {
  const { user } = useAuth(); // Get the current user

  if (!user) {
    // Show a loading or placeholder screen if the user data is not yet available
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render based on the user's role
  return (
    <View style={{ flex: 1 }}>
      {user.role === 'admin' ? <AdminScreen /> : <UserScreen />}
    </View>
  );
}
