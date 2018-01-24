import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Home.css';

const Home = (props) => {
  if (props.userStore.token) {
    return <Redirect push to="/taps" />;
  }
  return (
    <div className="Home">
      <h1>Data.world + Singer</h1>
      <p>This app, allows you to configure and download an executable Singer</p>
      <p>To get Started:</p>
      <a href={process.env.REACT_APP_OAUTH_AUTH_URL}>
        <Button bsStyle="primary" className="login">
          Login with data.world
        </Button>
      </a>
    </div>
  );
};

Home.propTypes = {
  userStore: PropTypes.shape({
    token: PropTypes.string
  }).isRequired
};

export default inject('userStore')(observer(Home));
