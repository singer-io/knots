import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Tap.css';

const Tap = ({ tap, logo, name, repo, version }) => (
  <div className="Tap">
    <Link to={`/connect/?tap=${tap}`}>
      <div className="logo-container">
        <img className="logo" src={logo} alt="Tap logo" />
      </div>
    </Link>
    <div className="info">
      <Link to={`/connect/?tap=${tap}&version=${version}`}>
        <div className="name">{name}</div>
      </Link>
      <div className="repo">
        <a href={repo} target="_blank">
          View repo
        </a>
      </div>
    </div>
  </div>
);

Tap.propTypes = {
  logo: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  tap: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired
};

export default Tap;
