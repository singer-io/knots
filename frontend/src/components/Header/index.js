import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Header.css';

const App = ({ title }) => (
  <div className="Header">
    <h2 className="title">{title}</h2>
  </div>
);

export default App;
