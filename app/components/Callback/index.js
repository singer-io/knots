// @flow

import React from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import Loader from '../Loader';

type Props = {
  location: { search: string },
  userStore: { token: '' },
  getToken: (code: string) => void
};

const Callback = (props: Props) => {
  console.log('The props', props);
  const { code } = queryString.parse(props.location.search);

  if (props.userStore.token) {
    return <Redirect push to="/target/" />;
  }

  if (code) {
    props.getToken(code);
    return <Loader />;
  }
  return <Redirect push to="/" />;
};

export default Callback;
