import React from 'react';
import { useParams } from 'react-router-dom';
import './BrandPage.css'; // Стили для страницы бренда

const BrandPage = () => {
  const { brandName } = useParams(); // Получаем название бренда из URL

  // Массив с товарами для каждого бренда
  const brandProducts = {
    nike: [
      { id: 1, name: 'Nike Air Max', price: 10000, image: require('../assets/1.png') },
      { id: 2, name: 'Nike Zoom', price: 12000, image: require('../assets/2.png') }
    ],
    adidas: [
      { id: 3, name: 'Adidas Ultraboost', price: 9000, image: require('../assets/9.png') },
      { id: 4, name: 'Adidas NMD', price: 9500, image: require('../assets/10.png') }
    ],
    // Добавьте товары для других брендов
  };

  // Получаем товары для выбранного бренда
  const products = brandProducts[brandName.toLowerCase()] || [];

  return (
    <div className="brand-page">
      <h1>Товары бренда {brandName}</h1>
      <div className="brand-products">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="brand-item">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3> {/* Название товара */}
              <p>{product.price} руб.</p> {/* Цена товара */}
            </div>
          ))
        ) : (
          <p>Товары этого бренда не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default BrandPage;