'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { User, AuthContextType } from '@/types';

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
        const response = await fetch('/api/auth');
        const data = await response.json();
        setDbUser(data.user);
        console.log('Fetched user data:', data.user);
        
        // Log subscription info
        if (data.user?.subscriptions) {
          console.log('User subscriptions:', data.user.subscriptions);
        }
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
  
  console.log('Has active subscription:', hasActiveSubscription);

  return (
    <AuthContext.Provider value={{ dbUser, isLoading, hasActiveSubscription }}>
      {children}
    </AuthContext.Provider>
  );
} 