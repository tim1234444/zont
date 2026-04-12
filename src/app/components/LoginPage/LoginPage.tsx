import React, { useEffect, useState, type FormEvent } from 'react';
import './LoginPage.scss';
import { Navigate, useNavigate } from 'react-router-dom';
import { checkSession, login } from '../../services/authService';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error('Введите пароль!');
      return;
    }

    const result = await login(password);

    if (result.success) {
      toast.success('Успешный вход');
      navigate('/tech/dashboard');
    } else {
      toast.error(result.message || 'Ошибка авторизации');
    }
  };

  useEffect(() => {
    const verify = async () => {
      const auth = await checkSession();
      setIsAuthenticated(auth);
      setLoading(false);
    };

    verify();
  }, []);
  if (loading) {
    return (
      <div className="container">
        <div>Загрузка...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/tech/dashboard" replace />;
  }
  return (
    <div className="login-container container">
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`login-input`}
        />

        <button type="submit" className="login-button">
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
