import React, { useState } from 'react';
import { Button, TextInput, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'expo-router';
const API_BASE_URL = process.env.API_BASE_URL;
import {BASE_URL} from '../constant';
export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {    
      try {
        const response = await axios.post(`http://${BASE_URL}:8080/api/auth/login`, { username, password }, { timeout: 5000 });
    
        if (response.status === 200) {
          const data = response.data;
          console.log('Response Data:', data); // Log the response to see the structure
    
          if (data.token && data.role) {
            login(data.token, { id: data.id, role: data.role, username:data.username });
    
            // Navigate to the dashboard or appropriate route based on the role
            if (data.role === 'admin') {
              console.log('Navigating to Admin screen');
              router.push('/');
            } else {
              console.log('Navigating to User screen');
              router.push('/');
            }
            
          } else {
            alert('Invalid credentials');
          }
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error(error);
        alert(error || 'Error logging in');
      }

  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`http://${BASE_URL}:8080/api/auth/register`, { username, password }, { timeout: 5000 });
      if (response.status === 201) {
        alert('Registration successful! You can now log in.');
        setIsRegister(false); // Switch back to login form
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert(error || 'Error registering user');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isRegister ? 'Register' : 'Login'}</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {isRegister ? (
        <>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setIsRegister(false)}>
            <Text style={styles.secondaryButtonText}>Switch to Login</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setIsRegister(true)}>
            <Text style={styles.secondaryButtonText}>Switch to Register</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4E0AF', // Light beige background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'serif',
    color: '#3e403f',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    backgroundColor: '#F9C0AB', // Soft pink background
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#3e403f', // Contrast text color
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#F9C0AB', // Soft pink border
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  secondaryButtonText: {
    color: '#3e403f', // Consistent text color
    fontWeight: '600',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  switchContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#3e403f',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

