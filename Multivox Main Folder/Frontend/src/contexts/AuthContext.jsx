import { createContext, useContext, useState, useEffect } from 'react';

// 1. Define the shape of our context (simplified default)
const AuthContext = createContext({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('voiceTranslatorUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        setError('Failed to load user session');
        console.error('Failed to parse user data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const mockUser = {
        id: '123',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        token: 'mock-jwt-token',
      };
      
      setUser(mockUser);
      localStorage.setItem('voiceTranslatorUser', JSON.stringify(mockUser));
    } catch (error) {
      setError('Login failed');
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const mockUser = {
        id: '456',
        name: userData.name,
        email: userData.email,
        token: 'mock-jwt-token',
      };
      
      setUser(mockUser);
      localStorage.setItem('voiceTranslatorUser', JSON.stringify(mockUser));
    } catch (error) {
      setError('Registration failed');
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voiceTranslatorUser');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;