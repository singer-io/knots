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

const path = require('path');
const shell = require('shelljs');
const { app } = require('electron');

const { targets } = require('./constants');
const { addKnotAttribute, writeFile } = require('./util');

let applicationFolder;
if (process.env.NODE_ENV === 'production') {
  applicationFolder = path.resolve(app.getPath('home'), '.knots');
} else {
  applicationFolder = path.resolve(__dirname, '../../');
}

const getTargets = () =>
  new Promise((resolve, reject) => {
    if (targets) {
      resolve(targets);
    } else {
      reject(new Error('No targets available'));
    }
  });

const addTarget = (target, knot) =>
  new Promise((resolve, reject) => {
    const knotPath = knot
      ? path.resolve(applicationFolder, knot, 'knot.json')
      : path.resolve(applicationFolder, 'knot.json');

    addKnotAttribute({ field: ['target'], value: target }, knotPath)
      .then(resolve)
      .catch(reject);
  });

const addTargetConfig = (config, knot) =>
  new Promise((resolve, reject) => {
    const configPath = knot
      ? path.resolve(applicationFolder, knot, 'target', 'config.json')
      : path.resolve(applicationFolder, 'config.json');
    writeFile(configPath, JSON.stringify(config))
      .then(() => {
        if (knot) {
          resolve();
        } else {
          shell.rm('-fr', path.resolve(applicationFolder, 'configs', 'target'));
          shell.mkdir(
            '-p',
            path.resolve(applicationFolder, 'configs', 'target')
          );
          shell.mv(
            path.resolve(applicationFolder, 'config.json'),
            path.resolve(applicationFolder, 'configs', 'target')
          );
          resolve();
        }
      })
      .catch(reject);
  });

module.exports = { getTargets, addTarget, addTargetConfig };
