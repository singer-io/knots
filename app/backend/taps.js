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
const { spawn } = require('child_process');
const fs = require('fs');
const shell = require('shelljs');

const {
  writeFile,
  readFile,
  addKnotAttribute,
  getApplicationFolder,
  createTemporaryKnotFolder,
  getTemporaryKnotFolder
} = require('./util');
const { taps, commands } = require('./constants');

let runningProcess;

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
      // Create new temporary knot folder
      createTemporaryKnotFolder();

      writeFile(
        path.resolve(getTemporaryKnotFolder(), 'knot.json'),
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

const getSchema = (req) =>
  new Promise((resolve, reject) => {
    const knotPath = getTemporaryKnotFolder();
    const stdoutStream = fs.createWriteStream(
      path.resolve(knotPath, 'tap', 'catalog.json'),
      { flags: 'a' }
    );
    const discoveryCommand = commands.runDiscovery(
      knotPath,
      req.body.tap.name,
      req.body.tap.image
    );

    const runDiscovery = spawn(
      discoveryCommand.split(' ')[0],
      discoveryCommand.split(' ').slice(1),
      {
        detached: true
      }
    );
    runningProcess = runDiscovery;

    runDiscovery.stderr.on('data', (data) => {
      if (!process.env.NODE_ENV !== 'test') {
        req.io.emit('schemaLog', data.toString());
      }
    });

    runDiscovery.stdout.pipe(stdoutStream);

    runDiscovery.on('exit', (code) => {
      if (code > 0) {
        reject(
          new Error(
            `${commands.runDiscovery(
              knotPath,
              req.body.tap.name,
              req.body.tap.image
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
      ? path.resolve(getApplicationFolder(), knot, 'tap', 'catalog.json')
      : path.resolve(getApplicationFolder(), 'configs', 'tap', 'catalog.json');
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
      ? path.resolve(getApplicationFolder(), knot, 'tap', 'config.json')
      : path.resolve(getTemporaryKnotFolder(), 'tap', 'config.json');

    writeFile(configPath, JSON.stringify(tapConfig))
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
      ? path.resolve(getApplicationFolder(), knot, 'tap', 'catalog.json')
      : path.resolve(getApplicationFolder(), 'catalog.json');

    writeFile(catalogPath, JSON.stringify(schemaObject))
      .then(() => {
        if (knot) {
          // Catalog file already written to file, no further action required
          resolve();
        } else {
          // Remove previous catalog file if any
          shell.rm(
            '-f',
            path.resolve(
              getApplicationFolder(),
              'configs',
              'tap',
              'catalog.json'
            )
          );

          // Move catalog file from root of directory to configs folder
          shell.mv(
            path.resolve(getApplicationFolder(), 'catalog.json'),
            path.resolve(getApplicationFolder(), 'configs', 'tap')
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
      ? path.resolve(getApplicationFolder(), 'knots', knot, 'knot.json')
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
  terminateDiscovery,
  createKnot
};
