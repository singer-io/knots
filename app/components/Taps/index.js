// @flow
import React, { Component } from 'react';

import Header from '../Header';
import Progress from '../Progress';

import './Taps.css';

export default class Taps extends Component<{}> {
  render() {
    return (
      <div>
        <Header />{' '}
        <div className="container knot-wiz">
          <div className="col-md-8 offset-md-2">
            <div className="progress" style={{ height: '2px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: '33.333%' }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
            <Progress />
            <div className="pt-4">
              <h2>Replication Options</h2>
              <form className="py-2">
                <div className="form-group">
                  <p>Hostname</p>
                  <input
                    type="text"
                    className="form-control"
                    id="inputHostName"
                  />
                </div>
                <div className="form-group">
                  <p>Username</p>
                  <input
                    type="text"
                    className="form-control"
                    id="inputUserName"
                  />
                </div>
                <div className="form-group">
                  <p>Password</p>
                  <input
                    type="password"
                    className="form-control"
                    id="inputPassword"
                  />
                </div>
                <div className="form-group">
                  <p>Database</p>
                  <input
                    type="text"
                    className="form-control"
                    id="inputDatabase"
                  />
                </div>
                <div className="form-group">
                  <p>Schema</p>
                  <input
                    type="text"
                    className="form-control"
                    id="inputSchema"
                  />
                </div>
                <button type="submit" className="btn btn-primary float-right">
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
