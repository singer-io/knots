/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Taps from './containers/Taps';
import Schema from './containers/Schema';
import Targets from './containers/Targets';
import Sync from './containers/Sync';
import SavedSync from './containers/SavedSync';

export default () => (
  <App>
    <Switch>
      <Route path="/saved-sync" component={SavedSync} />
      <Route path="/sync" component={Sync} />
      <Route path="/targets" component={Targets} />
      <Route path="/schema" component={Schema} />
      <Route path="/taps" component={Taps} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
