import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Home from './components/Home';
import Taps from './components/Taps';
import Connect from './components/Connect';
import registerServiceWorker from './registerServiceWorker';

import tapsStore from './stores/taps';

import './index.css';

ReactDOM.render(
  <Provider tapsStore={tapsStore}>
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/taps" component={Taps} />
        <Route path="/connect" component={Connect} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
