import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './index.css';
import Home from './components/Home';
import Taps from './components/Taps';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/taps" component={Taps} />
    </div>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
