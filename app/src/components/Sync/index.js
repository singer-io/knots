import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from 'react-bootstrap';
import Header from '../Header';

import './Sync.css';

class Sync extends Component {
  constructor() {
    super();

    this.submitFields = this.submitFields.bind(this);
  }

  submitFields() {
    return this;
  }

  render() {
    return (
      <div className="Connect">
        <Header>Redshift + data.world</Header>
        <div className="sync-body">
          <p>
            <span className="emphasis">Success! </span>
            Your pipeline is ready to be executed.
          </p>
          <div className="sync-knot">
            <div className="to-fro">
              <img
                src="https://cdn.zapier.com/storage/services/1e66b95901e0564c9e990c320705b69a.128x128.png"
                alt="tap logo"
                className="tap-logo"
              />
              <span className="to">&gt;</span>
              <img
                src="https://assets.data.world/assets/jumping_sparkle.5ed7a6ee85ba4718f189bef76607d36d.svg"
                alt="target logo"
                className="target-logo"
              />
            </div>
            <Button bsStyle="primary" bsSize="large" className="sync-button">
              Run
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('userStore', 'targetsStore')(observer(Sync));
