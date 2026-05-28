import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <div className="product-image-wrapper">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>
      </Link>
      <div className="product-info">
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        <div className="product-price">
          <span className="price-symbol">$</span>
          <span className="price-whole">{Math.floor(product.price)}</span>
          <span className="price-decimal">{((product.price % 1) * 100).toFixed(0).padStart(2, '0')}</span>
        </div>
        {product.countInStock === 0 && <span className="out-of-stock">Out of Stock</span>}
      </div>
    </div>
  );
};

export default ProductCard;
