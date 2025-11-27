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
import { register as registerWithEmail } from '@/service/firebase/register';
import { verifyToken } from '@/service/api/auth';
type AuthContextType = {
  isAuthenticated: boolean;
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (user: UserRegister) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      try {
        if (user) {
          const token = await user.getIdToken();
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

  const register = async (user: UserRegister): Promise<void> => {
    try {
      await registerWithEmail(user);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error en registro:', error);
        throw new Error(error.message || 'Error al registrarse');
      }
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await loginWithGoogle();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error con Google:', error);
        throw new Error(error.message || 'Error al iniciar sesión con Google');
      }
    }
  };

  const handleGithubLogin = async (): Promise<void> => {
    try {
      await loginWithGithub();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error con Github:', error);
        throw new Error(error.message || 'Error al iniciar sesión con Github');
      }
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await firebaseLogout();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al cerrar sesión:', error);
        throw new Error(error.message || 'Error al cerrar sesión');
      }
    }
  };

  const getToken = async (): Promise<string | null> => {
    if (!currentUser) return null;
    try {
      return await currentUser.getIdToken();
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    isAuthenticated: !!currentUser,
    currentUser,
    loading,
    login,
    register,
    loginWithGoogle: handleGoogleLogin,
    loginWithGithub: handleGithubLogin,
    logout: handleLogout,
    getToken
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;