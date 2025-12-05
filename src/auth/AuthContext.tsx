import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  login as loginWithEmail,
  loginWithGoogle,
  loginWithGithub,
} from '@/service/firebase/login';
import { logout as firebaseLogout } from '@/service/firebase/logout';
import { useAuthService } from '@/service/api/auth.service';
type AuthContextType = {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  deleteUser: () => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * React provider that initializes Firebase auth listeners
 * and exposes auth methods and state to the application.
 *
 * @param children React subtree to wrap with authentication context
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {verifyToken} = useAuthService();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      try {
        if (user) {
          const token = await user.getIdToken();
          setToken(token);
          const data = await verifyToken(token);
          if (!data) {
            console.error('Invalid token data');
            setCurrentUser(null);
            return;
          } else if (data.exp && new Date(data.exp * 1000) < new Date()) {
            console.error('Token expired');
            setCurrentUser(null);
            return;
          } else {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const deleteUser = () => {
    setCurrentUser(null);
    setToken(null);
  }

  /**
   * Sign in using email/password.
   * @param email Email address
   * @param password Password
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error en login:', error);
        throw new Error(error.message || 'Error al iniciar sesión');
      }
    }
  };


  /** Sign in using Google OAuth popup. */
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await loginWithGoogle();
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message.includes("account-exists-with-different-credential") ? "Ya tienes una cuenta con este correo electrónico" : error.message;
        throw new Error(message || 'Error al iniciar sesión con Google');
      }
    }
  };

  /** Sign in using GitHub OAuth popup. */
  const handleGithubLogin = async (): Promise<void> => {
    try {
      await loginWithGithub();
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message.includes("account-exists-with-different-credential") ? "Ya tienes una cuenta con este correo electrónico" : error.message;
        throw new Error(message || 'Error al iniciar sesión con Github');
      }
    }
  };

  /** Logout the current user. */
  const handleLogout = async (): Promise<void> => {
    try {
      await firebaseLogout();
      setCurrentUser(null);
      setToken(null);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al cerrar sesión:', error);
        throw new Error(error.message || 'Error al cerrar sesión');
      }
    }
  };

  const value: AuthContextType = {
    isAuthenticated: !!currentUser,
    currentUser,
    token,
    loading,
    deleteUser,
    login,
    loginWithGoogle: handleGoogleLogin,
    loginWithGithub: handleGithubLogin,
    logout: handleLogout,
  };

  if (loading) {
    return (
      <div className='full-view'>
        <div className='spinner-border'>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to consume the authentication context.
 * @throws Error if used outside of `AuthProvider`
 */
export default AuthContext;
