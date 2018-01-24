import React from 'react';
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../Header';
import './Connection.css';

const Connection = () => (
  <div className="Taps">
    <Header>
      Configure <span className="emphasis">Redshift</span> Connection
    </Header>
    <div className="body">
      <form>
        <FormGroup controlId="formBasicText">
          <ControlLabel className="control-label">Hostname</ControlLabel>
          <FormControl type="text" value="" onChange={this.handleChange} />
          <ControlLabel>User name</ControlLabel>
          <FormControl type="text" value="" onChange={this.handleChange} />
          <ControlLabel>Password</ControlLabel>
          <FormControl type="text" value="" onChange={this.handleChange} />
          <ControlLabel>Database</ControlLabel>
          <FormControl type="text" value="" onChange={this.handleChange} />
          <ControlLabel>
            Schema <span className="normal">(optional)</span>
          </ControlLabel>
          <FormControl type="text" value="" onChange={this.handleChange} />
        </FormGroup>
      </form>
      <div className="navigation">
        <Link to="/taps">
          <Button>
            <i className="fa fa-long-arrow-left" aria-hidden="true" />Back: Taps
          </Button>
        </Link>
        <Link to="/schema">
          <Button bsStyle="primary">
            Next: Schema<i
              className="fa fa-long-arrow-right"
              aria-hidden="true"
            />
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default Connection;
