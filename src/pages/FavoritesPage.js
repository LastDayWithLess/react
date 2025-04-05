// src/pages/FavoritesPage.jsx
import React from 'react';

const FavoritesPage = ({ favorites, removeFromFavorites }) => {
  return (
    <div>
      <h1>Избранное</h1>
      {favorites.length === 0 ? (
        <p>В вашем избранном пока нет товаров.</p>
      ) : (
        <div>
          {favorites.map((product) => (
            <div key={product.id} className="favorite-item">
              <img src={product.images[0]} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>{product.price} руб.</p>
              <button onClick={() => removeFromFavorites(product.id)}>
                Удалить из избранного
              </button> {/* Кнопка для удаления из избранного */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
