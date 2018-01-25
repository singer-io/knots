import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import queryString from 'query-string';
import Header from '../Header';
import ConnectionForm from './ConnectionForm';
import Navigtion from '../Navigation';
import './Connection.css';

class Connection extends Component {
  constructor() {
    super();

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    const { tap } = queryString.parse(this.props.location.search);
    this.props.tapsStore.getTapFields(tap);
  }

  handleFieldChange(e) {
    const { name, value } = e.target;
    this.props.tapsStore.setTapFields(name, value);
  }

  submit() {
    this.props.tapsStore.submitFields();
  }

  render() {
    return (
      <div className="Taps">
        <Header>
          Configure <span className="emphasis">Redshift</span> Connection
        </Header>
        <div className="body">
          <ConnectionForm
            fields={this.props.tapsStore.tapFields}
            handleChange={this.handleFieldChange}
          />
          <Navigtion
            back={{ name: 'Taps', path: '/taps' }}
            next={{ name: 'Schema', path: '/schema', onClick: this.submit }}
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
    setTapFields: PropTypes.func,
    submitFields: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired
};

export default inject('tapsStore')(observer(Connection));
