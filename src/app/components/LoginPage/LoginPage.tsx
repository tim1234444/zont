import React, { useState, type FormEvent } from 'react';
import './LoginPage.scss';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }

    setError('');

    const result = await login(password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Ошибка авторизации');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`login-input ${error ? 'input-error' : ''}`}
        />
        {error && <span className="error-text">{error}</span>}
        <button type="submit" className="login-button">
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
