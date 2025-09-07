import React from 'react';
import ProductCard from '../components/ProductCard';

const Products = ({ products, addToCart }) => {
  return (
    <div>
      <h1>Products</h1>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default Products;
