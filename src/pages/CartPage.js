import React, { useContext } from 'react';
import { CartContext } from '../App';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  // Проверка на пустую корзину
  if (!cartItems || cartItems.length === 0) {
    return <p>Ваша корзина пуста.</p>;
  }

  // Рассчитываем общую сумму
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="cart-page">
      <h1>Корзина</h1>

      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img
              src={item.images[0] || 'fallback-image.png'} // Fallback изображение
              alt={item.name}
              className="product-image"
            />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>{item.price} руб.</p>
            </div>
            <button
              className="remove-item-button"
              onClick={() => removeFromCart(item.id)} // Используем removeFromCart
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p><strong>Общая сумма:</strong> {totalPrice} руб.</p>
      </div>
    </div>
  );
};

export default CartPage;
