import React from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Button } from 'react-bootstrap';

import Header from '../Header';
import './Home.css';

const Home = () => (
  <div className="Home">
    <Header>My Knots</Header>
    <h1>
      Oops! There is <i>Knothing</i> here
    </h1>
    <p>This app, allows you to configure and download an executable Singer</p>
    <Link to="/taps">
      <Button bsStyle="primary" className="login">
        Get Started
      </Button>
    </Link>
  </div>
);

export default inject()(observer(Home));
