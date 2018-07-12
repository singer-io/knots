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

const { spawn, exec } = require('child_process');

const dockerInstalled = (mockSpawn) =>
  new Promise((resolve, reject) => {
    const spawnFunction = mockSpawn ? mockSpawn : spawn;

    // Try to find out the docker version installed
    const dockerVersion = spawnFunction('docker', ['-v']);

    // A version number was returned, docker is installed
    dockerVersion.stdout.on('data', (version) => {
      resolve(version.toString('utf8'));
    });

    dockerVersion.on('exit', (code) => {
      if (code > 0) {
        reject(new Error('Unable to run Docker'));
      }
    });
  });

const dockerRunning = (mockSpawn) =>
  new Promise((resolve, reject) => {
    const spawnFunction = mockSpawn ? mockSpawn : spawn;

    // Try to find out the docker version installed
    const dockerVolumes = spawnFunction('docker', ['volume', 'ls']);

    // A version number was returned, docker is installed
    dockerVolumes.stdout.on('data', (version) => {
      resolve(version.toString('utf8'));
    });

    dockerVolumes.on('exit', (code) => {
      if (code > 0) {
        reject(new Error('Unable to get Docker volumes'));
      }
    });
  });

module.exports = { dockerInstalled, dockerRunning };
