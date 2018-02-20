import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Home from './components/Home';
import Taps from './components/Taps';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

ReactDOM.render(
  <Provider>
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/taps" component={Taps} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
