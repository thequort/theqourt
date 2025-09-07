import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';

const Checkout = ({ cart, setCart }) => {
  const [customer, setCustomer] = useState({ name: '', address: '' });
  const navigate = useNavigate();

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    try {
      const order = {
        customer,
        items: cart,
        total: getTotal(),
        createdAt: new Date()
      };
      await firestore.collection('orders').add(order);
      alert('Order placed successfully!');
      setCart([]);
      navigate('/');
    } catch (error) {
      console.error('Error placing order: ', error);
      alert('Error placing order');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" value={customer.name} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Shipping Address" value={customer.address} onChange={handleChange} required />
        <h3>Order Summary</h3>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>{item.name} - ${item.price}</li>
          ))}
        </ul>
        <h4>Total: ${getTotal()}</h4>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
