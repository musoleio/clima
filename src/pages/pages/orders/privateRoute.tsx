// src/components/privateRoute.tsx

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PrivateRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Check your authentication status here
    const isAuthenticated = true; // Replace with your actual authentication check

    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login page
    }
  }, []);

  return children;
}
