'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/app/lib/api';

export function useAuth(requireAuth = true) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const token = apiService.token;
      
      if (!token) {
        throw new Error('No token found');
      }

      // Verify token with backend
      const result = await apiService.verifyToken();
      
      if (result.success) {
        setIsAuthenticated(true);
        setUser(apiService.getUser());
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      
      if (requireAuth) {
        router.push('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/admin/login');
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    logout,
    checkAuth
  };
}