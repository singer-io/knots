import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import queryString from 'query-string';
import Header from '../Header';
import Loader from '../Loader';
import Navigtion from '../Navigation';

import './ConnectTarget.css';

class ConnectTarget extends Component {
  constructor() {
    super();

    this.fetchFields = this.fetchFields.bind(this);
  }

  componentWillMount() {
    this.fetchFields();
  }

  fetchFields() {
    const { target, version } = queryString.parse(this.props.location.search);
    this.props.targetsStore.getTargetCredentials(target, version);
  }

  render() {
    return (
      <div className="Connect">
        <Header>
          Configure <span className="emphasis">data.world</span> Connection
        </Header>
        <div className="connect-body">
          {this.props.targetsStore.loading && <Loader />}
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
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired
};

export default inject('targetsStore')(observer(ConnectTarget));
