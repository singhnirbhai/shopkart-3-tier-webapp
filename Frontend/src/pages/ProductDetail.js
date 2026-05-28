import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import API from '../api/axios';
import Rating from '../components/Rating';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      setReviewMsg('Review submitted!');
      setReviewComment('');
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Error');
    }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (!product) return <div className="container"><h2>Product not found</h2></div>;

  return (
    <div className="container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          <div className="detail-price">${product.price.toFixed(2)}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-meta">
            <span><strong>Brand:</strong> {product.brand}</span>
            <span><strong>Category:</strong> {product.category}</span>
          </div>
        </div>
        <div className="product-detail-action">
          <div className="action-card">
            <div className="action-row">
              <span>Price:</span>
              <span className="action-price">${product.price.toFixed(2)}</span>
            </div>
            <div className="action-row">
              <span>Status:</span>
              <span className={product.countInStock > 0 ? 'in-stock' : 'out-stock'}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {product.countInStock > 0 && (
              <>
                <div className="action-row">
                  <span>Qty:</span>
                  <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map(x => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>
                <button className={`btn btn-primary btn-block ${added ? 'btn-success' : ''}`} onClick={handleAddToCart}>
                  <FaShoppingCart /> {added ? 'Added!' : 'Add to Cart'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {product.reviews.length === 0 && <p className="no-reviews">No reviews yet</p>}
        {product.reviews.map((r, i) => (
          <div key={i} className="review-card">
            <strong>{r.name}</strong>
            <Rating value={r.rating} />
            <p>{r.comment}</p>
            <small>{new Date(r.createdAt).toLocaleDateString()}</small>
          </div>
        ))}

        {user ? (
          <form className="review-form" onSubmit={handleReview}>
            <h3>Write a Review</h3>
            {reviewMsg && <div className="alert">{reviewMsg}</div>}
            <select value={reviewRating} onChange={e => setReviewRating(e.target.value)}>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
            <textarea placeholder="Your review..." value={reviewComment}
              onChange={e => setReviewComment(e.target.value)} required />
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        ) : (
          <p>Please <a href="/login">sign in</a> to write a review</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
