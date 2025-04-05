import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import './App.css';
import banner1 from './assets/banner1.png';
import banner2 from './assets/banner2.png';
import banner3 from './assets/banner3.png';
import banner4 from './assets/banner4.png';

export const CartContext = createContext();

function App() {
  const [cart, setCart] = useState([]); 
  const [favorites, setFavorites] = useState([]); 
// шаблон
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const addToFavorites = (product) => {
    setFavorites((prevFavorites) => [...prevFavorites, product]);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const banners = [banner1, banner2, banner3, banner4];

  const products = [
    { id: 1, name: 'Product 1', images: [require('./assets/new1.png')] },
    { id: 2, name: 'Product 2', images: [require('./assets/new2.png')] },
    { id: 3, name: 'Product 3', images: [require('./assets/new3.png')] },
    { id: 4, name: 'Product 4', images: [require('./assets/new4.png')] },
    { id: 5, name: 'Product 5', images: [require('./assets/new5.png')] },
    { id: 6, name: 'Product 5', images: [require('./assets/new5.png')] },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    const container = document.querySelector('.brands-container');
    const items = document.querySelectorAll('.brand-item');

    let cloneItems = [];
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      container.appendChild(clone);
      cloneItems.push(clone);
    });

    let scrollSpeed = 0.5;
    let position = 0;

    const scroll = () => {
      position -= scrollSpeed;
      if (position <= -items.length * (150 + 20)) {
        position = 0;
      }
      container.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(scroll);
    };

    scroll();
  }, []);

  const [zoomedImageIndex, setZoomedImageIndex] = useState(null); // Для увеличенного изображения
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setIsModalOpen(true);
    setZoomedImageIndex(null); // Сбрасываем увеличение
  };
  
  const handleImageClick = (index) => {
    setZoomedImageIndex(zoomedImageIndex === index ? null : index); // Увеличить или вернуть
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCartOrFavorites = (action) => {
    if (!selectedSize) {
      alert('Выберите размер перед добавлением!');
      return;
    }
    alert(`${action} добавлен: ${selectedProduct.name}, размер: ${selectedSize}`);
    closeModal();
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* Главная страница */}
          <Route
            path="/"
            element={
              <>
                {/* Секция с кнопками брендов */}
                <div className="brands-slider">
        <div className="brands-container">
          <a href="/brand/nike" className="brand-item">
            <img
              src={require('./assets/nike.png')}
              alt="Nike"
              className="brand-image"
            />
          </a>
          <a href="/brand/adidas" className="brand-item">
            <img
              src={require('./assets/adidas.png')}
              alt="Adidas"
              className="brand-image"
            />
          </a>
          <a href="/brand/puma" className="brand-item">
            <img
              src={require('./assets/puma.png')}
              alt="Puma"
              className="brand-image"
            />
          </a>
          <a href="/brand/new-balance" className="brand-item">
            <img
              src={require('./assets/NB.png')}
              alt="New Balance"
              className="brand-image"
            />
          </a>
          <a href="/brand/asics" className="brand-item">
            <img
              src={require('./assets/under_armour.png')}
              alt="Under Armour"
              className="brand-image"
            />
          </a>
          <a href="/brand/reebok" className="brand-item">
            <img
              src={require('./assets/reebok.png')}
              alt="Reebok"
              className="brand-image"
            />
          </a>
          <a href="/brand/converse" className="brand-item">
            <img
              src={require('./assets/converse.png')}
              alt="Converse"
              className="brand-image"
            />
          </a>
          <a href="/brand/vans" className="brand-item">
            <img
              src={require('./assets/vans.png')}
              alt="Vans"
              className="brand-image"
            />
          </a>
          <a href="/brand/jordan" className="brand-item">
            <img
              src={require('./assets/jordan.png')}
              alt="Jordan"
              className="brand-image"
            />
          </a>
          <a href="/brand/fila" className="brand-item">
            <img
              src={require('./assets/fila.png')}
              alt="Fila"
              className="brand-image"
            />
          </a>
        </div>
      </div>

                {/* Секция с баннерами */}
                <div className="banner-slider">
                  <div
                    className="banner-container"
                    style={{
                      transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                  >
                    {banners.map((banner, index) => (
                      <div className="banner" key={index}>
                        <img src={banner} alt={`Banner ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Секция с новинками */}
                <div className="new-products">
                  <h2 className="section-title">Новинки</h2>
                  <div className="products-container">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="product-item"
                        onClick={() => openModal(product)}
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="product-image"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }
          />

          {/* Страницы корзины и избранного */}
          <Route path="/cart" element={<CartPage cart={cart} />} />
          <Route
            path="/favorites"
            element={<FavoritesPage favorites={favorites} />}
          />
        </Routes>
           

       {/* Модальное окно */}
{isModalOpen && selectedProduct && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3 className="modal-title">{selectedProduct.name}</h3>
        <button className="close-modal" onClick={closeModal}>
        </button>
        <button className="close-modal" onClick={closeModal}>
          <i className="fas fa-times"></i> 
        </button>
        
        <button
          className="add-to-favorites"
          onClick={() => handleAddToCartOrFavorites('Избранное')}
        >
          <i className="fas fa-heart"></i>
        </button>
      </div>

      <div className="modal-content">
        <div className="modal-images">
          {selectedProduct.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product image ${index + 1}`}
              className={`modal-image ${zoomedImageIndex === index ? 'zoomed' : ''}`}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
        <div className="modal-details">
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Выберите размер</option>
            <option value="S">41</option>
            <option value="M">42</option>
            <option value="L">43</option>
          </select>
          
        </div>
        <div className="modal-actions">
          <button
            onClick={() => handleAddToCartOrFavorites('Товар в корзину')}
            className="modal-action-button"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  </div>
)}


              
      </div>
    </Router>
  );
}


export default App;
