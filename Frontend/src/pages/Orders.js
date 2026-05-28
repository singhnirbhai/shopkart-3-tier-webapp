import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaTruck } from 'react-icons/fa';
import API from '../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const successId = searchParams.get('success');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="container">
      {successId && (
        <div className="success-banner">
          <FaCheckCircle className="success-icon" />
          <h2>Order Placed Successfully!</h2>
          <p>Order ID: {successId}</p>
        </div>
      )}
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-cart">
          <FaBox className="empty-icon" />
          <h2>No orders yet</h2>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-label">ORDER #</span>
                  <span className="order-id">{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <div>
                  <span className="order-label">DATE</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="order-label">TOTAL</span>
                  <span className="order-total">${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="order-status">
                  {order.isDelivered ? (
                    <span className="badge badge-success"><FaTruck /> Delivered</span>
                  ) : (
                    <span className="badge badge-pending"><FaTruck /> In Transit</span>
                  )}
                </div>
              </div>
              <div className="order-items">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                    <span>Qty: {item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
