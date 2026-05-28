import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import API from '../api/axios';

const Checkout = () => {
  const { cartItems, getTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({
    fullName: '', address: '', city: '', postalCode: '', country: ''
  });

  const itemsPrice = getTotal();
  const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name, qty: item.qty, image: item.image,
          price: item.price, product: item._id
        })),
        shippingAddress: address,
        paymentMethod: 'Cash on Delivery',
        itemsPrice, shippingPrice, taxPrice, totalPrice
      };
      const { data } = await API.post('/orders', orderData);
      clearCart();
      navigate(`/orders?success=${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    }
    setLoading(false);
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        <div className="checkout-form">
          <h2>Shipping Address</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required value={address.fullName}
                onChange={e => setAddress({...address, fullName: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" required value={address.address}
                onChange={e => setAddress({...address, address: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input type="text" required value={address.city}
                  onChange={e => setAddress({...address, city: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" required value={address.postalCode}
                  onChange={e => setAddress({...address, postalCode: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" required value={address.country}
                onChange={e => setAddress({...address, country: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Placing Order...' : `Place Order - $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item._id} className="checkout-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <p>{item.qty} x ${item.price.toFixed(2)}</p>
              </div>
              <span>${(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="summary-row"><span>Items:</span><span>${itemsPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping:</span><span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax:</span><span>${taxPrice.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total:</span><span>${totalPrice.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
