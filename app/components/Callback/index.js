// @flow
/*
 * Knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */

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
