import { useEffect, useState } from 'react';
import { AuthContext } from '../hooks/auth';


// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUiLoading, setUiLoader] = useState(false)
  useEffect(() => {
    setIsAuthenticated(!!JSON.parse(localStorage.getItem('loggedInUser')));
  }, [])
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isUiLoading, setUiLoader }}>
      {children}
    </AuthContext.Provider>
  );
};

