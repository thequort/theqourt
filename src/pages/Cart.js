import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cart, removeFromCart }) => {
  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div>
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price}
                <button onClick={() => removeFromCart(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <h2>Total: ${getTotal()}</h2>
          <Link to="/checkout">
            <button>Checkout</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
