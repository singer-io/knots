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
const { exec } = require('child_process');
const shell = require('shelljs');
const { app } = require('electron');

const { writeFile, readFile, addKnotAttribute } = require('./util');
const { taps, commands } = require('./constants');

let applicationFolder;
let runningProcess;
if (process.env.NODE_ENV === 'production') {
  applicationFolder = path.resolve(app.getPath('home'), '.knots');
} else {
  applicationFolder = path.resolve(__dirname, '../../');
}

const createKnot = (tap, knotPath) =>
  new Promise((resolve, reject) => {
    if (knotPath) {
      addKnotAttribute(
        {
          field: ['tap'],
          value: {
            name: tap.name,
            image: tap.image,
            specImplementation: tap.specImplementation
          }
        },
        knotPath
      )
        .then(() => {
          resolve();
        })
        .catch(reject);
    } else {
      // Create knots folder if it doesn't exist
      shell.mkdir('-p', applicationFolder);

      writeFile(
        path.resolve(applicationFolder, 'knot.json'),
        JSON.stringify({
          tap: {
            name: tap.name,
            image: tap.image,
            specImplementation: tap.specImplementation
          }
        })
      )
        .then(() => {
          resolve();
        })
        .catch(reject);
    }
  });

const writeConfig = (config, configPath, knot) =>
  new Promise((resolve, reject) => {
    writeFile(configPath, JSON.stringify(config))
      .then(() => {
        if (knot) {
          // Config file already written to file, no further action required
          resolve();
        } else {
          // Remove any previously saved temp config
          shell.rm('-rf', path.resolve(applicationFolder, 'configs', 'tap'));
          shell.mkdir('-p', path.resolve(applicationFolder, 'configs', 'tap'));

          // Move written config file from root of directory to configs folder
          shell.mv(
            path.resolve(applicationFolder, 'config.json'),
            path.resolve(applicationFolder, 'configs', 'tap')
          );
          resolve();
        }
      })
      .catch(reject);
  });

const getSchema = (req, knot) =>
  new Promise((resolve, reject) => {
    const knotPath = knot
      ? path.resolve(applicationFolder, knot)
      : path.resolve(applicationFolder, 'configs');
    const runDiscovery = exec(commands.runDiscovery(knotPath, req.body.tap), {
      detached: true
    });
    runningProcess = runDiscovery;

    runDiscovery.stderr.on('data', (data) => {
      req.io.emit('schemaLog', data.toString());
    });

    runDiscovery.on('exit', (code) => {
      if (code > 0) {
        reject(
          new Error(
            `${commands.runDiscovery(
              applicationFolder,
              req.body.tap
            )} command failed`
          )
        );
      }
      resolve();
    });
  });

const readSchema = (knot) =>
  new Promise((resolve, reject) => {
    const schemaPath = knot
      ? path.resolve(applicationFolder, knot, 'tap', 'catalog.json')
      : path.resolve(applicationFolder, 'configs', 'tap', 'catalog.json');
    readFile(schemaPath)
      .then((schemaString) => {
        try {
          // Try to turn to object to validate it's a valid object
          const schema = JSON.parse(schemaString);

          // All good, return the schema object
          resolve(schema);
        } catch (error) {
          // Not a valid object, pass on the error
          reject(error);
        }
      })
      .catch(reject);
  });

const addConfig = (req) =>
  new Promise((resolve, reject) => {
    const { knot, tapConfig, skipDiscovery } = req.body;

    const configPath = knot
      ? path.resolve(applicationFolder, knot, 'tap', 'config.json')
      : path.resolve(applicationFolder, 'config.json');

    // Write the config to configs/tap/
    writeConfig(tapConfig, configPath, knot)
      .then(() => {
        if (skipDiscovery) {
          resolve({});
        } else {
          // Get tap schema by running discovery mode
          getSchema(req, knot)
            .then(() => {
              // Schema now on file, read it and return the result
              readSchema(knot)
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        }
      })
      .catch(reject);
  });

const getTaps = () =>
  new Promise((resolve, reject) => {
    if (taps) {
      resolve(taps);
    } else {
      reject(new Error('No taps available'));
    }
  });

const writeSchema = (schemaObject, knot) =>
  new Promise((resolve, reject) => {
    const catalogPath = knot
      ? path.resolve(applicationFolder, knot, 'tap', 'catalog.json')
      : path.resolve(applicationFolder, 'catalog.json');

    writeFile(catalogPath, JSON.stringify(schemaObject))
      .then(() => {
        if (knot) {
          // Catalog file already written to file, no further action required
          resolve();
        } else {
          // Remove previous catalog file if any
          shell.rm(
            '-f',
            path.resolve(applicationFolder, 'configs', 'tap', 'catalog.json')
          );

          // Move catalog file from root of directory to configs folder
          shell.mv(
            path.resolve(applicationFolder, 'catalog.json'),
            path.resolve(applicationFolder, 'configs', 'tap')
          );
          resolve();
        }
      })
      .catch(reject);
  });

const terminateDiscovery = () => {
  if (runningProcess) {
    return runningProcess.pid;
  }
};

const addTap = (tap, knot) =>
  new Promise((resolve, reject) => {
    const knotPath = knot
      ? path.resolve(applicationFolder, 'knots', knot, 'knot.json')
      : '';
    createKnot(tap, knotPath)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });

module.exports = {
  getTaps,
  addTap,
  addConfig,
  writeSchema,
  runningProcess,
  terminateDiscovery
};
