import React, { useState, type FormEvent } from 'react';
import './LoginPage.scss';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
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
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Ошибка авторизации');
    }
  };

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
