import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, signInWithGoogle, signInAnon } from '@/lib/firebase';

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (method: 'google' | 'anonymous' = 'google') => {
    setLoading(true);
    try {
      if (method === 'google') {
        await signInWithGoogle();
      } else {
        await signInAnon();
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAnonymous: user?.isAnonymous || false,
    displayName: user?.displayName || 'Anonymous',
    email: user?.email || null,
    photoURL: user?.photoURL || null,
  };
} 