// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Header from '../../Header';
import styles from './Create.css';

const Create = () => (
  <div className={styles.Create}>
    <Header>My Knots</Header>
    <h1>
      Oops! There is <i>Knothing</i> here
    </h1>
    <p>This app, allows you to configure and download an executable Singer</p>
    <Link to="/taps">
      <Button bsStyle="primary" className={styles.getStarted}>
        Get Started
      </Button>
    </Link>
  </div>
);

export default Create;
