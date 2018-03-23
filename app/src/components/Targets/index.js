import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Header from '../Header';
import Loader from '../Loader';
import Target from './Target';
import './Targets.css';

class Targets extends Component {
  componentWillMount() {
    this.props.targetsStore.getTargets();
  }

  render() {
    const { activeTargets, inactiveTargets } = this.props.targetsStore;
    return (
      <div className="Targets">
        <Header>Choose a target</Header>
        <div className="targets-body">
          {this.props.targetsStore.loading && <Loader />}
          {!this.props.targetsStore.loading && (
            <div>
              <div className="targets-active">
                <p>
                  <span className="emphasis">Targets </span>consume data from
                  taps and do something with it, like load it into a file, API
                  or database.
                </p>
                <div className="target-list">
                  {activeTargets.map((target) => (
                    <Target
                      key={target.key}
                      name={target.name}
                      logo={target.logo}
                      target={target.key}
                      version={target.version}
                    />
                  ))}
                </div>
              </div>
              <div className="targets-inactive">
                <p>
                  <span className="emphasis">Coming soon...</span>
                </p>
                <div className="target-list-inactive">
                  {inactiveTargets.map((target) => (
                    <Target
                      key={target.key}
                      name={target.name}
                      logo={target.logo}
                      target={target.key}
                    />
                  ))}
                </div>
              </div>
              <Link to="/schema">
                <Button>
                  <i className="fa fa-long-arrow-left" aria-hidden="true" />
                  Back: Schema
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Targets.propTypes = {
  targetsStore: PropTypes.shape({
    activeTargets: PropTypes.object,
    inactiveTargets: PropTypes.object,
    getTargets: PropTypes.func,
    loading: PropTypes.bool
  }).isRequired
};

export default inject('targetsStore')(observer(Targets));
