// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import knots from './knots';
import taps from './taps';

const rootReducer = combineReducers({
  knots,
  taps,
  router
});

export default rootReducer;
