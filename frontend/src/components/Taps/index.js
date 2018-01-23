import React from 'react';
import { Button, TabPane } from 'react-bootstrap';
import Header from '../Header';
import Tap from './Tap';
import './Taps.css';

const App = () => (
  <div className="Taps">
    <Header>Choose a tap</Header>
    <div className="body">
      <p>
        <span className="emphasis">Taps</span> extract data from any source.
        Choose a tap based on where your data is currently hosted.
      </p>
      <div className="tap-list">
        <Tap
          name="Redshift"
          logo="https://redash.io/assets/images/temp/AmazonRedshift.png"
          repo="https://github.com/datadotworld/tap-redshift"
        />
      </div>
    </div>
  </div>
);

export default App;
