import React from 'react';
import { Button } from 'react-bootstrap';
import Header from '../Header';
import './Finish.css';
import run from '../../images/run.png';

const Finish = () => (
  <div className="Taps">
    <Header>Redshift + data.world</Header>
    <div className="body">
      <p>
        <span className="emphasis">Success! </span>
        Your pipeline is ready to be downloaded and executed.
      </p>
      <Button className="download" bsStyle="primary">
        <p className="download-text">Download</p>
        <p className="filename">(redshift+dw-singer.tar.gz)</p>
      </Button>
      <p className="emphasis">
        Once the file has been saved to the local file system
      </p>
      <div className="image-container">
        <img className="image" src={run} alt="run instructions" />
      </div>
    </div>
  </div>
);

export default Finish;
