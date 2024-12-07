import React, { useState } from 'react';
import { Button, TextInput, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'expo-router';


export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {    
      try {
        const response = await axios.post('http://192.168.29.145:3000/api/auth/login', { username, password }, { timeout: 5000 });
    
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
      const response = await axios.post('http://192.168.29.145:3000/api/auth/register', { username, password }, { timeout: 5000 });
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
    backgroundColor: '#F4E0AF', // Background color set to light beige
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'serif',
    color: '#3e403f',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#F9C0AB', // Button color set to soft pink
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#3e403f', // Text color for better contrast
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F9C0AB', // Border color matches soft pink
  },
  secondaryButtonText: {
    color: '#3e403f' // Text color matches soft pink
  },
});
