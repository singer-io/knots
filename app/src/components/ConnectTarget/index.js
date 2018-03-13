import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Header from '../Header';
import Loader from '../Loader';
import Navigtion from '../Navigation';
import DataWorld from './DataWorld';

import './ConnectTarget.css';

/* eslint-disable */
class ConnectTarget extends Component {
  render() {
    return (
      <div className="Connect">
        <Header>
          Configure <span className="emphasis">data.world</span> Connection
        </Header>
        <div className="connect-body">
          {this.props.targetsStore.loading && <Loader />}
          <DataWorld />
          {!this.props.targetsStore.loading && (
            <div>
              <Navigtion
                back={{ name: 'Targets', path: '/targets' }}
                next={{
                  name: 'Finish',
                  path: '/targets'
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

ConnectTarget.propTypes = {
  targetsStore: PropTypes.shape({
    getTargetCredentials: PropTypes.func,
    loading: PropTypes.bool
  }).isRequired
};

export default inject('targetsStore')(observer(ConnectTarget));
