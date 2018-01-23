import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';

const App = () => (
  <div className="App">
    <h1>Data.world + Singer</h1>
    <p>This app, allows you to configure and download an executable Singer</p>
    <p>To get Started:</p>
    <Link to="/taps">
      <Button bsStyle="primary">Login with data.world</Button>
    </Link>
  </div>
);

export default App;
