import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import queryString from 'query-string';
import Header from '../Header';
import ConnectionForm from './ConnectionForm';
import Navigtion from '../Navigation';
import './Connection.css';

class Connection extends Component {
  componentWillMount() {
    console.log('These are the props', this.props);
    const { tap } = queryString.parse(this.props.location.search);
    this.props.tapsStore.getTapFields(tap);
  }

  render() {
    return (
      <div className="Taps">
        <Header>
          Configure <span className="emphasis">Redshift</span> Connection
        </Header>
        <div className="body">
          <ConnectionForm fields={this.props.tapsStore.tapFields} />
          <Navigtion
            back={{ name: 'Taps', path: '/taps' }}
            next={{ name: 'Schema', path: '/schema' }}
          />
        </div>
      </div>
    );
  }
}

Connection.propTypes = {
  tapsStore: PropTypes.shape({
    tapFields: PropTypes.object,
    getTapFields: PropTypes.func,
    setTapName: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired
};

export default inject('tapsStore')(observer(Connection));
