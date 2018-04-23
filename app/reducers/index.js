// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import knots from './knots';
import taps from './taps';
import targets from './targets';
import user from './user';
import progress from './progress';

const rootReducer = combineReducers({
  progress,
  knots,
  taps,
  targets,
  user,
  router
});

export default rootReducer;
