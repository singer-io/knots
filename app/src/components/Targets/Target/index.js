import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Target.css';

const Target = ({ target, logo, name, version }) => (
  <div className="Target">
    <Link to={`/connect/?target=${target}`}>
      <div className="logo-container">
        <img className="logo" src={logo} alt="Target logo" />
      </div>
    </Link>
    <div className="info">
      <Link to={`/connect/?target=${target}&version=${version}`}>
        <div className="name">{name}</div>
      </Link>
    </div>
  </div>
);

Target.propTypes = {
  logo: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired
};

export default Target;
