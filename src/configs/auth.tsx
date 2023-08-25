// AuthProvider.js
import React, { createContext, useContext } from 'react';
import firebase from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }) => {
  const auth = getAuth(firebase);
  const [user, loading, error] = useAuthState(auth);

  console.log(`From authContex: ${JSON.stringify(user)}`);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
