// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import knots from './knots';

const rootReducer = combineReducers({
  knots,
  router
});

export default rootReducer;
