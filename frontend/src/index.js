import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import Home from './components/Home';
import Taps from './components/Taps';
import Connection from './components/Connection';
import Schema from './components/Schema';
import Dataworld from './components/Dataworld';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/taps" component={Taps} />
      <Route path="/connection" component={Connection} />
      <Route path="/schema" component={Schema} />
      <Route path="/dataworld" component={Dataworld} />
    </div>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
