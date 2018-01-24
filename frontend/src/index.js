import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Home from './components/Home';
import Taps from './components/Taps';
import Connection from './components/Connection';
import Schema from './components/Schema';
import Dataworld from './components/Dataworld';
import Finish from './components/Finish';
import Callback from './components/Callback';
import registerServiceWorker from './registerServiceWorker';
import usersStore from './stores/user';

import './index.css';

ReactDOM.render(
  <Provider userStore={usersStore}>
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/taps" component={Taps} />
        <Route path="/connection" component={Connection} />
        <Route path="/schema" component={Schema} />
        <Route path="/dataworld" component={Dataworld} />
        <Route path="/finish" component={Finish} />
        <Route path="/callback" component={Callback} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
