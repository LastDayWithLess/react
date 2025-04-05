import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./RegisterPage.css"

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Введите логин и пароль');
      return;
    }

    // Храним пользователей в localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Проверка, существует ли пользователь
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      alert('Пользователь уже существует!');
      return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Регистрация успешна!');
    navigate('/login'); // Переход на логин
  };

  return (
    <div className="auth-page">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
};

export default RegisterPage;
