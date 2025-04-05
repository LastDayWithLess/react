import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BrandSlider from './components/BrandSlider';
import Header from './components/Header';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import BrandPage from './pages/BrandPage';
import ProtectedRoute from './pages/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import './App.css';

import banner1 from './assets/banner1.png';
import banner2 from './assets/banner2.png';
import banner3 from './assets/banner3.png';
import banner4 from './assets/banner4.png';

export const CartContext = createContext();

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const banners = [banner1, banner2, banner3, banner4];
  const products = [
    { id: 1, name: 'Dunk Low SB Pro', images: [require('./assets/new1.png')], price: 15000 },
    { id: 2, name: 'Air Jordan 1', images: [require('./assets/new2.png')], price: 12000 },
    { id: 3, name: 'Product 3', images: [require('./assets/new3.png')], price: 10000 },
    { id: 4, name: 'Product 4', images: [require('./assets/new4.png')], price: 20000 },
    { id: 5, name: 'Product 5', images: [require('./assets/new5.png')], price: 18000 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const addToCart = (product) => setCartItems((prevItems) => [...prevItems, product]);
  const removeFromCart = (itemId) => setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleImageClick = (index) => {
    setZoomedImageIndex(zoomedImageIndex === index ? null : index);
  };

  const handleAddToCartOrFavorites = (action) => {
    if (!selectedSize) {
      alert('Выберите размер перед добавлением!');
      return;
    }
    if (action === 'Товар в корзину') {
      addToCart(selectedProduct);
      alert(`${selectedProduct.name} добавлен в корзину, размер: ${selectedSize}`);
    } else {
      alert(`${selectedProduct.name} добавлен в избранное, размер: ${selectedSize}`);
    }
    closeModal();
  };

  const Product = ({ product, openModal }) => (
    <div className="product-item" onClick={() => openModal(product)}>
      <img src={product.images[0]} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>{product.price} руб.</p>
    </div>
  );

  const Home = () => (
    <>
      <BrandSlider />
      <div className="banner-slider">
        <div className="banner-container" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {banners.map((banner, index) => (
            <div className="banner" key={index}>
              <img src={banner} alt={`Banner ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="new-products">
        <h2 className="section-title">Новинки</h2>
        <div className="products-container">
          {products.map((product) => (
            <Product key={product.id} product={product} openModal={openModal} />
          ))}
        </div>
      </div>
    </>
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      <Router>
        <div className="App">
          <Header logout={logout} isAuthenticated={isAuthenticated} />
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage onLogin={login} />} />
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/brand/:brandName" element={<BrandPage />} />
            <Route path="/cart" element={<CartPage />} />
            {/*<Route path="/favorites" element={<FavoritesPage />} />*/}
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </div>
      </Router>

      {isModalOpen && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedProduct.name}</h3>
              <button className="close-modal" onClick={closeModal}>
                <i className="fas fa-times"></i>
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
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
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
    </CartContext.Provider>
  );
}

export default App;
