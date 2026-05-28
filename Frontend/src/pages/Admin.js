import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaBox, FaShoppingBag } from 'react-icons/fa';
import API from '../api/axios';

const Admin = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', image: '', category: '', brand: '', countInStock: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const { data } = await API.get('/products');
    setProducts(data);
  };

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/all');
      setOrders(data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = { ...form, price: Number(form.price), countInStock: Number(form.countInStock) };
      if (editProduct) {
        await API.put(`/products/${editProduct._id}`, productData);
      } else {
        await API.post('/products', productData);
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name, description: product.description, price: product.price,
      image: product.image, category: product.category, brand: product.brand,
      countInStock: product.countInStock
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await API.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  const handleDeliver = async (id) => {
    await API.put(`/orders/${id}/deliver`);
    fetchOrders();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditProduct(null);
    setForm({ name: '', description: '', price: '', image: '', category: '', brand: '', countInStock: '' });
  };

  return (
    <div className="container">
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="admin-tabs">
        <button className={`tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
          <FaBox /> Products ({products.length})
        </button>
        <button className={`tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          <FaShoppingBag /> Orders ({orders.length})
        </button>
      </div>

      {tab === 'products' && (
        <div className="admin-section">
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <FaPlus /> Add Product
          </button>

          {showForm && (
            <form className="admin-form" onSubmit={handleSubmit}>
              <h3>{editProduct ? 'Edit Product' : 'New Product'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input required value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" required value={form.countInStock} onChange={e => setForm({...form, countInStock: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input required value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input required value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{editProduct ? 'Update' : 'Create'}</button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          )}

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.image} alt={p.name} className="table-img" /></td>
                    <td>{p.name}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>{p.category}</td>
                    <td>{p.countInStock}</td>
                    <td className="table-actions">
                      <button className="btn-icon edit" onClick={() => handleEdit(p)}><FaEdit /></button>
                      <button className="btn-icon delete" onClick={() => handleDelete(p._id)}><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-section">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>User</th><th>Date</th><th>Total</th><th>Paid</th><th>Delivered</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.name || 'N/A'}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>${o.totalPrice.toFixed(2)}</td>
                    <td>{o.isPaid ? <FaCheck className="text-green" /> : <FaTimes className="text-red" />}</td>
                    <td>{o.isDelivered ? <FaCheck className="text-green" /> : <FaTimes className="text-red" />}</td>
                    <td>
                      {!o.isDelivered && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleDeliver(o._id)}>
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
