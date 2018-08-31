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

const {
  writeFile,
  readFile,
  addKnotAttribute,
  createTemporaryKnotFolder,
  getTemporaryKnotFolder
} = require('./util');
const { taps, commands } = require('./constants');

let runningProcess;

const createKnot = (tap, uuid, modifyKnot) =>
  new Promise((resolve, reject) => {
    if (modifyKnot) {
      addKnotAttribute(
        {
          field: ['tap'],
          value: {
            name: tap.name,
            image: tap.image,
            specImplementation: tap.specImplementation,
            identifier: tap.identifier
          }
        },
        path.resolve(getTemporaryKnotFolder(uuid), 'knot.json')
      )
        .then(() => {
          resolve();
        })
        .catch(reject);
    } else {
      // Create new temporary knot folder
      createTemporaryKnotFolder(uuid);

      writeFile(
        path.resolve(getTemporaryKnotFolder(uuid), 'knot.json'),
        JSON.stringify({
          tap: {
            name: tap.name,
            image: tap.image,
            specImplementation: tap.specImplementation,
            identifier: tap.identifier
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
    const knotPath = getTemporaryKnotFolder(req.body.uuid);

    shell.rm('-rf', path.resolve(knotPath, 'tap', 'catalog.json'));
    shell.mkdir('-p', path.resolve(knotPath, 'tap'));

    const discoveryCommand = commands.runDiscovery(knotPath, req.body.tap);

    const runDiscovery = exec(discoveryCommand, {
      detached: true
    });

    const failError = `${discoveryCommand} command failed`;

    runningProcess = runDiscovery;

    runDiscovery.stderr.on('data', (data) => {
      if (!process.env.NODE_ENV !== 'test') {
        req.io.emit('schemaLog', data.toString());
      }
    });

    runDiscovery.on('exit', (code) => {
      if (code > 0) {
        reject(new Error(failError));
      }
      resolve();
    });

    runDiscovery.on('error', () => {
      reject(new Error(failError));
    });
  });

const readSchema = (uuid) =>
  new Promise((resolve, reject) => {
    const schemaPath = path.resolve(
      getTemporaryKnotFolder(uuid),
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
    const { tapConfig, uuid, skipDiscovery } = req.body;

    const configPath = path.resolve(
      getTemporaryKnotFolder(uuid),
      'tap',
      'config.json'
    );

    writeFile(configPath, JSON.stringify(tapConfig))
      .then(() => {
        if (skipDiscovery) {
          resolve({});
        } else if (process.env.NODE_ENV !== 'test') {
          // Get tap schema by running discovery mode
          getSchema(req)
            .then(() => {
              // Schema now on file, read it and return the result
              readSchema(req.body.uuid)
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        } else {
          resolve();
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

const writeSchema = (schemaObject, uuid) =>
  new Promise((resolve, reject) => {
    shell.mkdir('-p', path.resolve(getTemporaryKnotFolder(uuid), 'tap'));
    const catalogPath = path.resolve(
      getTemporaryKnotFolder(uuid),
      'tap',
      'catalog.json'
    );

    writeFile(catalogPath, JSON.stringify(schemaObject))
      .then(() => {
        resolve();
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
  addConfig,
  writeSchema,
  runningProcess,
  terminateDiscovery,
  createKnot,
  getSchema,
  readSchema
};
