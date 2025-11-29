import { useEffect, useState, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { checkSession } from '../services/authService';

interface AuthenticatedPageProps {
  children: JSX.Element;
}

export const AuthenticatedPage = ({ children }: AuthenticatedPageProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const auth = await checkSession();
      setIsAuthenticated(auth);
      setLoading(false);
    };

    verify();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
