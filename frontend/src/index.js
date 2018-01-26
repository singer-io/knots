import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Home from './components/Home';
import Taps from './components/Taps';
import Connection from './components/Connection';
import Schema from './components/Schema';
import DataWorld from './components/DataWorld';
import Finish from './components/Finish';
import Callback from './components/Callback';
import registerServiceWorker from './registerServiceWorker';

import usersStore from './stores/user';
import tapsStore from './stores/taps';

import './index.css';

ReactDOM.render(
  <Provider userStore={usersStore} tapsStore={tapsStore}>
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/taps" component={Taps} />
        <Route path="/connection" component={Connection} />
        <Route path="/schema" component={Schema} />
        <Route path="/dataworld" component={DataWorld} />
        <Route path="/finish" component={Finish} />
        <Route path="/callback" component={Callback} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
