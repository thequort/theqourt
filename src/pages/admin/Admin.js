import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase';
import AdminDashboard from './AdminDashboard';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const unsubscribeProducts = firestore.collection('products').onSnapshot(snapshot => {
      const productsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProducts(productsData);
    });

    const unsubscribeOrders = firestore.collection('orders').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
      const ordersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setOrders(ordersData);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await firestore.collection('products').doc(editingProduct.id).update(product);
        alert('Product updated successfully!');
        setEditingProduct(null);
      } else {
        await firestore.collection('products').add(product);
        alert('Product added successfully!');
      }
      setProduct({ name: '', description: '', price: '', imageUrl: '' });
    } catch (error) {
      console.error('Error saving product: ', error);
      alert('Error saving product');
    }
  };

  const handleEdit = (productToEdit) => {
    setEditingProduct(productToEdit);
    setProduct({
      name: productToEdit.name,
      description: productToEdit.description,
      price: productToEdit.price,
      imageUrl: productToEdit.imageUrl
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await firestore.collection('products').doc(id).delete();
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product: ', error);
        alert('Error deleting product');
      }
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setProduct({ name: '', description: '', price: '', imageUrl: '' });
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <AdminDashboard />
      
      <hr />

      <h3>Order List</h3>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h4>Order from {order.customer.name}</h4>
          <p>Address: {order.customer.address}</p>
          <p>Total: ${order.total}</p>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>{item.name} - ${item.price}</li>
            ))}
          </ul>
        </div>
      ))}

      <hr />

      <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Product Description" value={product.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Product Price" value={product.price} onChange={handleChange} required />
        <input type="text" name="imageUrl" placeholder="Image URL" value={product.imageUrl} onChange={handleChange} required />
        <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
        {editingProduct && <button type="button" onClick={cancelEdit}>Cancel Edit</button>}
      </form>

      <hr />

      <h3>Product List</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <img src={p.imageUrl} alt={p.name} style={{ maxWidth: '100%' }} />
            <h4>{p.name}</h4>
            <p>${p.price}</p>
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
