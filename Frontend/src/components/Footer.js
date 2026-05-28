import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to top
      </button>
    </div>
    <div className="footer-content">
      <div className="footer-section">
        <h4>Get to Know Us</h4>
        <a href="#!">About Us</a>
        <a href="#!">Careers</a>
        <a href="#!">Press Releases</a>
      </div>
      <div className="footer-section">
        <h4>Connect with Us</h4>
        <a href="#!">Facebook</a>
        <a href="#!">Twitter</a>
        <a href="#!">Instagram</a>
      </div>
      <div className="footer-section">
        <h4>Make Money with Us</h4>
        <a href="#!">Sell on ShopKart</a>
        <a href="#!">Become an Affiliate</a>
        <a href="#!">Advertise</a>
      </div>
      <div className="footer-section">
        <h4>Let Us Help You</h4>
        <a href="#!">Your Account</a>
        <a href="#!">Returns Centre</a>
        <a href="#!">Help</a>
      </div>
    </div>
    <div className="footer-bottom">
      <span className="footer-logo"><span className="logo-shop">Shop</span><span className="logo-kart">Kart</span></span>
      <p>&copy; 2024 ShopKart. All rights reserved. (Demo Project)</p>
    </div>
  </footer>
);

export default Footer;
