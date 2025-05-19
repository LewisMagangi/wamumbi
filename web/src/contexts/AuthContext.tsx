import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

// Define user roles
export type UserRole = 'admin' | 'volunteer' | 'donor' | 'team_leader' | 'guest';

// Define user type
export interface AuthUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

// Define the shape of our auth context
type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasPermission: (action: string, resource: string) => boolean;
  role: UserRole | null;
  logout: () => void;
  login: (username: string, password: string) => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  hasPermission: () => false,
  role: null,
  logout: () => {},
  login: async () => {},
});

// For development only - mock user for testing
const MOCK_USER: AuthUser = {
  id: 1,
  username: 'admin',
  name: 'Admin User',
  email: 'admin@charity.org',
  role: 'admin',
  profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
};

// Provider component that wraps the app and makes auth object available
export function AuthProvider({ children }: { children: ReactNode }) {
  const [mockUser, setMockUser] = useState<AuthUser | null>(null);
  
  // In a real app, this would be a real API call
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: false, // Disable automatic fetching, we'll use mock data
  });

  // For development, use the mock user
  useEffect(() => {
    // Simulate API load time
    const timer = setTimeout(() => {
      setMockUser(MOCK_USER);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Use the real user if available, otherwise use the mock user
  const currentUser = user || mockUser;
  
  // Determine if user is authenticated
  const isAuthenticated = !!currentUser;
  
  // Determine if user is an admin
  const isAdmin = currentUser?.role === 'admin';
  
  // Current user role
  const role = currentUser?.role || null;

  // Permission checking function
  const hasPermission = (action: string, resource: string): boolean => {
    if (!isAuthenticated) return false;
    
    // Admin can do anything
    if (isAdmin) return true;
    
    // Define permissions for different roles
    const permissions: Record<string, Record<string, string[]>> = {
      volunteer: {
        read: ['campaigns', 'events', 'projects', 'teams', 'blog', 'donations'],
        create: ['comments', 'registrations'],
        update: ['profile']
      },
      donor: {
        read: ['campaigns', 'events', 'projects', 'blog', 'donations'],
        create: ['donations'],
        update: ['profile']
      },
      team_leader: {
        read: ['campaigns', 'events', 'projects', 'teams', 'blog', 'donations', 'volunteers'],
        create: ['comments', 'discussions', 'registrations', 'polls'],
        update: ['profile', 'teams', 'discussions', 'polls']
      },
      guest: {
        read: ['campaigns', 'events', 'blog'],
        create: [],
        update: []
      }
    };
    
    // Check if the user's role has the permission
    if (!role || !permissions[role]) return false;
    
    const rolePermissions = permissions[role];
    return !!rolePermissions[action]?.includes(resource);
  };

  // Mock login function
  const login = async (username: string, password: string) => {
    // Simulate login process
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
          setMockUser(MOCK_USER);
          resolve();
        } else if (username === 'volunteer' && password === 'volunteer') {
          setMockUser({
            id: 2,
            username: 'volunteer',
            name: 'Volunteer User',
            email: 'volunteer@charity.org',
            role: 'volunteer',
            profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
          });
          resolve();
        } else if (username === 'donor' && password === 'donor') {
          setMockUser({
            id: 3,
            username: 'donor',
            name: 'Donor User',
            email: 'donor@charity.org',
            role: 'donor',
            profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
          });
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setMockUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user: currentUser, 
      isLoading: isLoading && !mockUser, 
      isAuthenticated, 
      isAdmin,
      hasPermission,
      role,
      logout,
      login
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for components to get the auth context
export const useAuth = () => useContext(AuthContext);