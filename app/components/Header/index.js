// @flow
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
    <h5 className="my-0 mr-md-auto font-weight-normal">Knots</h5>
    <nav className="my-2 my-md-0 mr-md-3">
      <Link to="/" className="p-2 text-dark">
        My Knots
      </Link>
    </nav>
  </div>
);

export default Header;
