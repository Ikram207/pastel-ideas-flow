import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { UserProfile } from '@/types';

interface AuthContextValue {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_KEY = 'app_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async (email: string, _password: string) => {
    // Mock login: create a basic user from email
    const [firstName = 'Utilisateur', lastName = ''] = email.split('@')[0].split('.');
    const mock: UserProfile = { id: crypto.randomUUID(), firstName, lastName, email };
    setUser(mock);
    localStorage.setItem(LS_KEY, JSON.stringify(mock));
  };

  const signup = async (firstName: string, lastName: string, email: string, _password: string) => {
    const mock: UserProfile = { id: crypto.randomUUID(), firstName, lastName, email };
    setUser(mock);
    localStorage.setItem(LS_KEY, JSON.stringify(mock));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_KEY);
  };

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
