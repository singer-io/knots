import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Tap.css';

const Tap = ({ logo, name, repo }) => (
  <Link to="/connection" className="Tap">
    <div className="logo-container">
      <img className="logo" src={logo} alt="Tap logo" />
    </div>
    <div className="info">
      <div className="name">{name}</div>
      <div className="repo">
        <a href={repo}>View repo</a>
      </div>
    </div>
  </Link>
);

Tap.propTypes = {
  logo: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired
};

export default Tap;
