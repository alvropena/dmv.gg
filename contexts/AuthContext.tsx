'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { User } from '@prisma/client';

type AuthContextType = {
  dbUser: User | null;
  isLoading: boolean;
  hasActiveSubscription: boolean;
};

const AuthContext = createContext<AuthContextType>({
  dbUser: null,
  isLoading: true,
  hasActiveSubscription: false,
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded: isClerkLoaded, userId } = useAuth();
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setDbUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const hasActiveSubscription = Boolean(
    dbUser?.subscriptions?.some(
      sub => 
        sub.status === 'active' && 
        new Date(sub.currentPeriodEnd) > new Date()
    )
  );

  return (
    <AuthContext.Provider value={{ dbUser, isLoading, hasActiveSubscription }}>
      {children}
    </AuthContext.Provider>
  );
} 