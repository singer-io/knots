// @flow
import React from 'react';
import ReactLoading from 'react-loading';
import styles from './Loader.css';

const Loader = () => (
  <div className={styles.loader}>
    <ReactLoading type="spin" color="#4688f1" />
  </div>
);

export default Loader;
