import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Button } from 'react-bootstrap';
import Header from '../../Header';

import './Knots.css';

class Knots extends Component {
  render() {
    return (
      <div className="Knots">
        <Header>My Knots</Header>
        <div className="knots-body">
          {this.props.knotsStore.knots.map((knot) => (
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
              <p>{knot}</p>

              <div className="button-container">
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  className="sync-button"
                >
                  Run
                </Button>
              </div>
              <div className="synced">
                <div className="button-container">
                  <Button
                    bsStyle="primary"
                    bsSize="large"
                    className="synced-view"
                  >
                    Configure
                  </Button>
                </div>
                <div className="button-container">
                  <Button
                    bsStyle="primary"
                    bsSize="large"
                    className="synced-save"
                    onClick={this.showModal}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="new-knot">
            <Link to="/taps">
              <Button bsStyle="primary" bsSize="large">
                Create New Knot
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

Knots.propTypes = {
  knotsStore: PropTypes.shape({
    knots: PropTypes.object.isRequired
  }).isRequired
};

export default inject('knotsStore', 'userStore')(observer(Knots));
