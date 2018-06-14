/*
 * knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the
 * License.
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc.(http://data.world/).
 */

import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import knots from './knots';
import taps from './taps';
import targets from './targets';
import user from './user';
import progress from './progress';

const appReducer = combineReducers({
  progress,
  knots,
  taps,
  targets,
  user,
  router
});

const rootReducer = (state, action) => appReducer(state, action);
export default rootReducer;
