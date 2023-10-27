// PrivateRoute.js
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../configs/auth';

const PrivateRoute = ({ children }) => {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/pages/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return <>{user && children}</>;
};

export default PrivateRoute;
