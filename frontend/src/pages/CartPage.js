import React, { useEffect, useState } from 'react';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("access_token");
    
    try {
      const response = await fetch("http://localhost:8000/get_cart", {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Данные корзины:", data);  
        setCartItems(data);
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.detail || 'Не удалось загрузить корзину'}`);
      }
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
      alert('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8000/remove_from_cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.detail || 'Не удалось удалить товар'}`);
      } else {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.error("Ошибка при удалении товара:", error);
      alert('Ошибка соединения с сервером');
    }
  };

  if (loading) return <p>Загрузка...</p>;

  if (cartItems.length === 0) {
    return <p>Ваша корзина пуста.</p>;
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={`${item.images || '/fallback-image.png'}`} 
              alt={item.name}
              className="product-image"
            />

            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>{item.price} руб.</p>
            </div>
            <button
              className="remove-item-button"
              onClick={() => removeFromCart(item.id)}
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
