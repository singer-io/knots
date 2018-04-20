// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../../Header';
import styles from './Create.css';

const Create = () => (
  <div className={styles.Create}>
    <Header />
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">
          There is <em>knothing</em> here!
        </h1>
        <p className="lead">
          This app allows you to configure and download executable Singer
          pipelines.
        </p>
        <Link className="btn btn-primary btn-lg" to="/taps" role="button">
          Get Started
        </Link>
      </div>
    </div>
  </div>
);

export default Create;
