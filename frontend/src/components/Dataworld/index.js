import React from 'react';
import { Button, ControlLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../Header';
import './Dataworld.css';

const Schema = () => (
  <div className="Taps">
    <Header>
      Configure <span className="emphasis">data.world</span> Connection
    </Header>

    <div className="body">
      <ControlLabel>Dataset</ControlLabel>
      <select>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="opel">Opel</option>
        <option value="audi">Audi</option>
      </select>
      <div className="navigation">
        <Link to="/schema">
          <Button>
            <i className="fa fa-long-arrow-left" aria-hidden="true" />Back:
            Schema
          </Button>
        </Link>
        <Link to="/finish">
          <Button bsStyle="primary">
            Next: Finish<i
              className="fa fa-long-arrow-right"
              aria-hidden="true"
            />
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default Schema;
