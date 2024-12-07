import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { Redirect } from "expo-router";

export default function Content() {

  return (
    <View>
        <>
          <Text>Welcome, Content!</Text>   
        </>
    </View>
  );
}
