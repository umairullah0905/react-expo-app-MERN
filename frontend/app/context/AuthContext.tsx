import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadStoredData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);  // Ensure user is parsed
        setToken(storedToken);
        setUser(parsedUser);
        console.log('Loaded User:', parsedUser);  // Log user for verification
      }
    };

    loadStoredData();
  }, []);

  const login = async (token: string, user: User) => {
    console.log('User Object During Login:', user);  // Log user during login
    setToken(token);
    setUser(user);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));  // Store user as string

    console.log('User Role:', user.role);
    console.log('User Name:', user.username);  // Log username for verification

    if (user.role === 'admin') {
      router.push('/');
    } else {
      router.push('/');
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    router.push('/login');
  };

  const isAuthenticated = !!user && !!token; // Derive isAuthenticated from user and token

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
