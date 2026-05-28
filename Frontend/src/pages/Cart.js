import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, getTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (user) navigate('/checkout');
    else navigate('/login?redirect=checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container empty-cart">
        <FaShoppingBag className="empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet</p>
        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <Link to={`/product/${item._id}`}><h3>{item.name}</h3></Link>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => item.qty > 1 && updateQty(item._id, item.qty - 1)}><FaMinus /></button>
                <span>{item.qty}</span>
                <button onClick={() => item.qty < item.countInStock && updateQty(item._id, item.qty + 1)}><FaPlus /></button>
              </div>
              <div className="cart-item-subtotal">
                ${(item.price * item.qty).toFixed(2)}
              </div>
              <button className="cart-item-remove" onClick={() => removeFromCart(item._id)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items ({cartItems.reduce((a, i) => a + i.qty, 0)}):</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>{getTotal() > 100 ? 'FREE' : '$9.99'}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>${(getTotal() * 0.08).toFixed(2)}</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total:</span>
            <span>${(getTotal() + (getTotal() > 100 ? 0 : 9.99) + getTotal() * 0.08).toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
