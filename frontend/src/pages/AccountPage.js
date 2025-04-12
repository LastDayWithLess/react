import React, { useState, useEffect } from 'react';
import './AccountPage.css';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token'); 

    if (!token) {
      alert('Пожалуйста, войдите в систему');
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.name_user || '');
          setDescription(data.description || '');
          setPreview(data.image_profile || null);
        } else {
          const errorData = await response.json();
          alert(`Ошибка: ${errorData.detail || 'Не удалось загрузить профиль'}`);
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
        alert('Ошибка соединения с сервером');
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('Пожалуйста, войдите в систему');
      navigate('/login');
      return;
    }

    const profileData = {
      name_user: name,
      description: description,
      image_profile: preview,
    };

    try {
      const response = await fetch('http://localhost:8000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        alert('Профиль сохранён!');

        const userId = localStorage.getItem('access_token');
        localStorage.setItem(`userProfile_${userId}`, JSON.stringify(profileData));

        setName(profileData.name_user);
        setDescription(profileData.description);
        setPreview(profileData.image_profile);
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.detail || 'Не удалось сохранить профиль'}`);
      }
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
      alert('Ошибка соединения с сервером');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="account-page">
      <h2>Профиль пользователя</h2>
      <div className="profile-photo">
        {preview ? (
          <img src={preview} alt="Аватар" />
        ) : (
          <div className="photo-placeholder">Фото</div>
        )}
        <input type="file" onChange={handlePhotoChange} />
      </div>
      <input
        type="text"
        placeholder="Ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Описание о себе"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
};

export default AccountPage;
