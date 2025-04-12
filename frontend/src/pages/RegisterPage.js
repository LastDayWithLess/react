import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./RegisterPage.css";

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      alert('Введите email и пароль');
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.detail || "Ошибка регистрации");
      }
  
      alert(data.detail || "Регистрация успешна!");
      
      navigate("/check-email");  
  
    } catch (err) {
      alert(err.message);
    }
  };
  

  return (
    <div className="auth-page">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
};

export default RegisterPage;
