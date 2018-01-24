import React from 'react';
import './Header.css';

const Header = ({ children }) => (
  <div className="Header">
    <h2 className="title">{children}</h2>
  </div>
);

export default Header;
