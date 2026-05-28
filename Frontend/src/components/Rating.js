import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) stars.push(<FaStar key={i} className="star" />);
    else if (value >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="star" />);
    else stars.push(<FaRegStar key={i} className="star" />);
  }
  return (
    <div className="rating">
      {stars}
      {text && <span className="rating-text">{text}</span>}
    </div>
  );
};

export default Rating;
