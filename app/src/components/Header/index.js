import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ children }) => (
  <div className="Header">
    <h2 className="title">{children}</h2>
  </div>
);

Header.propTypes = {
  children: PropTypes.node.isRequired
};

export default Header;
