import { useState } from 'react';
import { AuthContext } from '../hooks/auth';


// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!JSON.parse(localStorage.getItem('token')));
  const [isUiLoading, setUiLoader] = useState(false)

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isUiLoading, setUiLoader }}>
      {children}
    </AuthContext.Provider>
  );
};

