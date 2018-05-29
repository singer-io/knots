/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Taps from './containers/Taps';
import Schema from './containers/Schema';
import Targets from './containers/Targets';
import Callback from './components/Callback';
import Sync from './containers/Sync';

export default () => (
  <App>
    <Switch>
      <Route path="/sync" component={Sync} />
      <Route path="/callback" component={Callback} />
      <Route path="/targets" component={Targets} />
      <Route path="/schema" component={Schema} />
      <Route path="/taps" component={Taps} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
