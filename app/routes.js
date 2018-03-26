/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Taps from './containers/Taps';
import Connect from './containers/Connect';
import Schema from './components/Schema';

export default () => (
  <App>
    <Switch>
      <Route path="/schema" component={Schema} />
      <Route path="/connect" component={Connect} />
      <Route path="/taps" component={Taps} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
