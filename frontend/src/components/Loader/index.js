import React from 'react';
import ReactLoading from 'react-loading';
import './Loader.css';

const Loader = () => (
  <div className="loader">
    <ReactLoading type="spin" color="#4688f1" />
  </div>
);

export default Loader;
