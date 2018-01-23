import React from 'react';
import './Header.css';

const Header = ({ title }) => (
  <div className="Header">
    <h2 className="title">{title}</h2>
  </div>
);

export default Header;
