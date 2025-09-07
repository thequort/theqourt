import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    numberOfOrders: 0,
    numberOfProducts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsSnapshot = await firestore.collection('products').get();
        const ordersSnapshot = await firestore.collection('orders').get();

        const numberOfProducts = productsSnapshot.size;
        const numberOfOrders = ordersSnapshot.size;
        const totalSales = ordersSnapshot.docs.reduce((total, doc) => total + doc.data().total, 0);

        setStats({
          totalSales,
          numberOfOrders,
          numberOfProducts,
        });
      } catch (error) {
        console.error("Error fetching stats: ", error);
      }
    };

    fetchStats();

    const unsubscribeOrders = firestore.collection('orders').onSnapshot(() => fetchStats());
    const unsubscribeProducts = firestore.collection('products').onSnapshot(() => fetchStats());

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, []);

  return (
    <div>
      <h3>Dashboard</h3>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '2rem 0' }}>
        <div style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center' }}>
          <h4>Total Sales</h4>
          <p>${stats.totalSales.toFixed(2)}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center' }}>
          <h4>Number of Orders</h4>
          <p>{stats.numberOfOrders}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center' }}>
          <h4>Number of Products</h4>
          <p>{stats.numberOfProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
