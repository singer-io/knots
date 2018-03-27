// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import knots from './knots';
import taps from './taps';
import targets from './targets';

const rootReducer = combineReducers({
  knots,
  taps,
  targets,
  router
});

export default rootReducer;
