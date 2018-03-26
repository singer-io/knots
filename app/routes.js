/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Taps from './containers/Taps';

export default () => (
  <App>
    <Switch>
      <Route path="/taps" component={Taps} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
