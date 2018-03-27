/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Taps from './containers/Taps';
import Connect from './containers/Connect';
import Schema from './containers/Schema';
import Targets from './containers/Targets';
import Target from './containers/Target';
import Callback from './components/Callback';

export default () => (
  <App>
    <Switch>
      <Route path="/callback" component={Callback} />
      <Route path="/target" component={Target} />
      <Route path="/targets" component={Targets} />
      <Route path="/schema" component={Schema} />
      <Route path="/connect" component={Connect} />
      <Route path="/taps" component={Taps} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
