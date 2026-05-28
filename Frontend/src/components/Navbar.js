import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCount } = useContext(CartContext);
  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/?keyword=${keyword}` : '/');
    setKeyword('');
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-shop">Shop</span><span className="logo-kart">Kart</span>
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text" placeholder="Search products..."
            value={keyword} onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit"><FaSearch /></button>
        </form>

        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/cart" className="nav-link cart-link" onClick={() => setMenuOpen(false)}>
            <FaShoppingCart />
            <span>Cart</span>
            {getCount() > 0 && <span className="cart-badge">{getCount()}</span>}
          </Link>

          {user ? (
            <div className="nav-dropdown">
              <button className="nav-link dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaUser />
                <span>{user.name}</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/orders" onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}>My Orders</Link>
                  {user.isAdmin && (
                    <Link to="/admin" onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}>Admin Panel</Link>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
              <FaUser /><span>Sign In</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
