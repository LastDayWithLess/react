import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link
import './Header.css';

function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false); // Состояние меню
  const [isSearchVisible, setSearchVisible] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {/* Значок меню */}
          <div className="menu-icon" onClick={(e) => {
            e.stopPropagation(); // Останавливаем всплытие
            toggleMenu();
          }}>
            <div className="menu-bar"></div>
            <div className="menu-bar"></div>
            <div className="menu-bar"></div>
          </div>
        </div>

        <div className={`header-right ${isMenuOpen ? 'menu-open' : ''}`}>
          {isSearchVisible && (
            <div className="search-container">
              <input
                type="text"
                className="search-bar"
                placeholder="Введите запрос..."
              />
              <button
                className="close-search-button"
                onClick={(e) => {
                  e.stopPropagation(); // Останавливаем всплытие
                  toggleSearch();
                }}
              >
                ✖
              </button>
            </div>
          )}
          {!isSearchVisible && (
            <button
              className="search-button"
              onClick={(e) => {
                e.stopPropagation(); // Останавливаем всплытие
                toggleSearch();
              }}
            >
              <i className="fas fa-search"></i>
            </button>
          )}

          {/* Используем Link для перехода на страницы избранного и корзины */}
            {/*<Link to="/favorites" className="header-icon">
              <i className="fas fa-heart"></i>
            </Link>*/}
          <Link to="/cart" className="header-icon">
            <i className="fas fa-shopping-cart"></i>
          </Link>
          <Link to="/account" className="header-icon">
            <i className="fas fa-user"></i>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
