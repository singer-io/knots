import React from 'react';
import { Link } from 'react-router-dom';
import './Tap.css';

const Tap = ({ logo, name, repo }) => (
  <Link to="/connection" className="Tap">
    <div className="logo">
      <img src={logo} />
    </div>
    <div className="info">
      <div className="name">{name}</div>
      <div className="repo">
        <a href={repo}>View repo</a>
      </div>
    </div>
  </Link>
);

export default Tap;
