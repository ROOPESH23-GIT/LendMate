import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Default demo accounts
export const DEMO_ACCOUNTS = [
  {
    id: 3,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'user',
    phone: '+91 98765 43210',
    title: 'Student / Renter'
  },
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@srmspaces.in',
    role: 'owner',
    phone: '+91 98401 23456',
    title: 'Space Owner (Potheri)'
  },
  {
    id: 2,
    name: 'Ananya Iyer',
    email: 'ananya@spaceschennai.com',
    role: 'owner',
    phone: '+91 94440 98765',
    title: 'Space Owner (Chennai)'
  },
  {
    id: 4,
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    role: 'user',
    phone: '+91 97890 12345',
    title: 'Student / Renter'
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lendmate_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    // Default to Priya Sharma (user)
    return DEMO_ACCOUNTS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lendmate_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lendmate_user');
    }
  }, [currentUser]);

  const login = async (email, role = 'user') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    }
  };

  const switchAccount = (user) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        switchAccount,
        logout,
        isOwner: currentUser?.role === 'owner'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
