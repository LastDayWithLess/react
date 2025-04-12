// src/components/BrandSlider.jsx

import React, { useEffect } from 'react';

const BrandSlider = () => {
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

    return () => clearInterval(scroll); // Очистка эффекта
  }, []);

  return (
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
  );
};

export default BrandSlider;
