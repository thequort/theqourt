import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div>
      <Link to={`/product/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%' }} />
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </Link>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
