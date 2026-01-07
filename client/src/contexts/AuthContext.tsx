import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  admin: {
    id: '1',
    email: 'admin@accesshub.com',
    name: 'Alex Thompson',
    role: 'admin',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
  },
  manager: {
    id: '2',
    email: 'manager@accesshub.com',
    name: 'Jordan Mitchell',
    role: 'manager',
    createdAt: new Date('2024-03-20'),
    lastLogin: new Date(),
  },
  user: {
    id: '3',
    email: 'user@accesshub.com',
    name: 'Casey Morgan',
    role: 'user',
    createdAt: new Date('2024-06-10'),
    lastLogin: new Date(),
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For demo: accept any email that matches a mock user or default to 'user' role
    const role = email.includes('admin') ? 'admin' : email.includes('manager') ? 'manager' : 'user';
    setUser({ ...mockUsers[role], email, lastLogin: new Date() });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      setUser({ ...mockUsers[role], lastLogin: new Date() });
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
