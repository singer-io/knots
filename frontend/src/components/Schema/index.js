import React from 'react';
import { Button, ControlLabel, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../Header';
import './Schema.css';

const Schema = () => (
  <div className="Taps">
    <Header>
      Configure <span className="emphasis">Redshift</span> Schema
    </Header>

    <div className="body">
      <Table bordered condensed hover>
        <thead>
          <tr>
            <th>Table/Stream</th>
            <th>Selected</th>
            <th>Replication Property</th>
          </tr>
        </thead>
        <tbody>
          <tr valign="middle">
            <td className="stream">users</td>
            <td className="selected">
              <div className="checkbox">
                <i className="fa fa-check" aria-hidden="true" />
              </div>
            </td>
            <td className="replication">
              <select>
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="opel">Opel</option>
                <option value="audi">Audi</option>
              </select>
            </td>
          </tr>
        </tbody>
      </Table>
      <form>
        <ControlLabel>Start Date</ControlLabel>
        <input type="date" className="date" />
      </form>
      <div className="navigation">
        <Link to="/connection">
          <Button>
            <i className="fa fa-long-arrow-left" aria-hidden="true" />Back:
            Connection
          </Button>
        </Link>
        <Link to="/dataworld">
          <Button bsStyle="primary">
            Next: data.world<i
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
