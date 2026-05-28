import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { FaFilter } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await API.get('/products/categories');
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/products?';
        if (keyword) url += `keyword=${keyword}&`;
        if (selectedCategory) url += `category=${selectedCategory}`;
        const { data } = await API.get(url);
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [keyword, selectedCategory]);

  return (
    <div className="home-page">
      {!keyword && (
        <div className="hero-banner">
          <div className="hero-content">
            <h1>Welcome to ShopKart</h1>
            <p>Discover amazing deals on millions of products</p>
          </div>
        </div>
      )}

      <div className="home-container">
        <aside className="sidebar">
          <h3><FaFilter /> Categories</h3>
          <ul className="category-list">
            <li
              className={!selectedCategory ? 'active' : ''}
              onClick={() => setSelectedCategory('')}
            >All Products</li>
            {categories.map(cat => (
              <li
                key={cat}
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => setSelectedCategory(cat)}
              >{cat}</li>
            ))}
          </ul>
        </aside>

        <div className="products-section">
          {keyword && (
            <h2 className="search-results-title">
              Search results for "{keyword}"
              <span className="result-count">({products.length} found)</span>
            </h2>
          )}
          {!keyword && selectedCategory && (
            <h2 className="search-results-title">{selectedCategory}</h2>
          )}
          {!keyword && !selectedCategory && (
            <h2 className="search-results-title">All Products</h2>
          )}

          {loading ? (
            <div className="loader">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try a different search term or category</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
