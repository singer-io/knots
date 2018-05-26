/*
 * Knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */

const path = require('path');
const { exec } = require('child_process');
const shell = require('shelljs');
const { app } = require('electron');

const { writeFile, readFile, addKnotAttribute } = require('./util');
const { taps, getTapFields, commands } = require('./constants');

let applicationFolder;
let runningProcess;
if (process.env.NODE_ENV === 'production') {
  applicationFolder = path.resolve(app.getPath('home'), 'knots');
} else {
  applicationFolder = path.resolve(__dirname, '../../');
}

const createKnot = (tapName, tapImage, knotPath) =>
  new Promise((resolve, reject) => {
    if (knotPath) {
      addKnotAttribute(
        {
          field: ['tap'],
          value: {
            name: tapName,
            image: tapImage
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
            name: tapName,
            image: tapImage
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
          resolve();
        } else {
          // Remove any previously saved temp config
          shell.rm('-rf', path.resolve(applicationFolder, 'configs', 'tap'));
          shell.mkdir('-p', path.resolve(applicationFolder, 'configs', 'tap'));
          shell.mv(
            path.resolve(applicationFolder, 'config.json'),
            path.resolve(applicationFolder, 'configs', 'tap')
          );
          resolve();
        }
      })
      .catch(reject);
  });

const getSchema = (req) =>
  new Promise((resolve, reject) => {
    const runDiscovery = exec(
      commands.runDiscovery(
        applicationFolder,
        req.body.tap.name,
        req.body.tap.image
      ),
      { detached: true }
    );
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
              req.body.tap.name,
              req.body.tap.image
            )} command failed`
          )
        );
      }
      resolve();
    });
  });

const readSchema = () =>
  new Promise((resolve, reject) => {
    const schemaPath = path.resolve(
      applicationFolder,
      'configs',
      'tap',
      'catalog.json'
    );
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
    const { knot } = req.body;
    let configPath;
    if (req.body.knot) {
      configPath = path.resolve(
        applicationFolder,
        'knots',
        knot,
        'tap',
        'config.json'
      );
    } else {
      configPath = path.resolve(applicationFolder, 'config.json');
    }

    // Write the config to configs/tap/
    writeConfig(req.body.tapConfig, configPath, knot)
      .then(() => {
        if (knot) {
          resolve();
        } else {
          // Get tap schema by running discovery mode
          getSchema(req)
            .then(() => {
              // Schema now on file, read it and return the result
              readSchema()
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

const fetchTapFields = (tap, image, knot) =>
  new Promise((resolve, reject) => {
    const knotPath = knot
      ? path.resolve(applicationFolder, 'knots', knot, 'knot.json')
      : '';
    createKnot(tap, image, knotPath)
      .then(() => {
        const fields = getTapFields(tap);

        if (fields.length === 0) {
          reject(new Error('Unknown tap'));
        } else {
          resolve(fields);
        }
      })
      .catch(reject);
  });

const writeSchema = (schemaObject, knot) =>
  new Promise((resolve, reject) => {
    const catalogPath = knot
      ? path.resolve(applicationFolder, 'knots', knot, 'tap', 'catalog.json')
      : path.resolve(applicationFolder, 'catalog.json');
    writeFile(catalogPath, JSON.stringify(schemaObject))
      .then(() => {
        if (knot) {
          resolve();
        } else {
          shell.rm(
            '-f',
            path.resolve(applicationFolder, 'configs', 'tap', 'catalog.json')
          );
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

module.exports = {
  getTaps,
  fetchTapFields,
  addConfig,
  writeSchema,
  runningProcess,
  terminateDiscovery
};
