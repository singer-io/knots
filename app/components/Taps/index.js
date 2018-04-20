// @flow
import React, { Component } from 'react';

import Header from '../Header';

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
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <a href="#" className="nav-link completed">
                  <span className="step">1</span>
                  <span className="oi oi-check" />
                </a>
                <small>Configure Tap</small>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link active">
                  <span className="step">2</span>
                  <span className="oi oi-check" />
                </a>
                <small>Replication Options</small>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link disabled">
                  <span className="step">3</span>
                  <span className="oi oi-check" />
                </a>
                <small>Configure Target</small>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link disabled">
                  <span className="step">4</span>
                  <span className="oi oi-check" />
                </a>
                <small>Save/Run</small>
              </li>
            </ul>
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
