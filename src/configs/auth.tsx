// AuthProvider.js
import { getAuth } from 'firebase/auth';
import { createContext, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from '../firebase/config';

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }) => {
  const auth = getAuth(firebase);
  const [user, loading, error] = useAuthState(auth);
  
  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
