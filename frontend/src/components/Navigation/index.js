import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import './Navigation.css';

const Navigation = ({ back, next }) => (
  <div className="navigation">
    <Link to={back.path}>
      <Button>
        <i className="fa fa-long-arrow-left" aria-hidden="true" />
        {`Back: ${back.name}`}
      </Button>
    </Link>
    <Link to={next.path}>
      <Button bsStyle="primary">
        {`Next: ${next.name}`}
        <i className="fa fa-long-arrow-right" aria-hidden="true" />
      </Button>
    </Link>
  </div>
);

Navigation.propTypes = {
  back: PropTypes.shape({
    name: PropTypes.string,
    path: PropTypes.string
  }).isRequired,
  next: PropTypes.shape({
    name: PropTypes.string,
    path: PropTypes.string
  }).isRequired
};

export default Navigation;
