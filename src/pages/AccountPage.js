import React, { useState, useEffect } from 'react';
import './AccountPage.css';

const AccountPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('userProfile'));
    if (savedData) {
      setName(savedData.name || '');
      setDescription(savedData.description || '');
      setPreview(savedData.photo || null);
    }
  }, []);

  const handleSave = () => {
    const data = { name, description, photo: preview };
    localStorage.setItem('userProfile', JSON.stringify(data));
    alert('Профиль сохранён!');
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
