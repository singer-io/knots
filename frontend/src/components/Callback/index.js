import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';

const Callback = (props) => {
  const { code } = queryString.parse(props.location.search);

  if (props.userStore.token) {
    return <Redirect push to="/taps" />;
  }

  if (code) {
    props.userStore.getToken(code);
    return <div>Loading</div>;
  }
  return <Redirect push to="/" />;
};

Callback.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired,
  userStore: PropTypes.shape({
    getToken: PropTypes.func,
    token: PropTypes.string
  }).isRequired
};

export default inject('userStore')(observer(Callback));
