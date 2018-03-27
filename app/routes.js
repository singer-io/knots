/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Taps from './containers/Taps';
import Connect from './containers/Connect';
import Schema from './containers/Schema';
import Targets from './components/Targets';

export default () => (
  <App>
    <Switch>
      <Route path="/targets" component={Targets} />
      <Route path="/schema" component={Schema} />
      <Route path="/connect" component={Connect} />
      <Route path="/taps" component={Taps} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
