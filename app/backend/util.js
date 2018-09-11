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
const fs = require('fs');
const os = require('os');
const shell = require('shelljs');
const { set } = require('lodash');
const { app } = require('electron');

const getApplicationFolder = () => {
  let applicationFolder;
  if (process.env.NODE_ENV === 'production') {
    if (app) {
      // Knots are stored on the user's home path in the packaged app
      applicationFolder = path.resolve(app.getPath('home'), '.knots');
    } else {
      // app is undefined when running tests, get home dir using node
      const homePath = os.homedir();
      applicationFolder = path.resolve(homePath, '.knots');
    }
  } else {
    // Use the repo during development
    applicationFolder = path.resolve(__dirname, '../..');
  }

  return applicationFolder;
};

const createTemporaryKnotFolder = (uuid) => {
  shell.rm('-rf', path.resolve(getApplicationFolder(), 'tmp'));

  shell.mkdir('-p', path.resolve(getApplicationFolder(), 'tmp', uuid, 'knot'));
  shell.mkdir(
    '-p',
    path.resolve(getApplicationFolder(), 'tmp', uuid, 'knot', 'tap')
  );
  shell.mkdir(
    '-p',
    path.resolve(getApplicationFolder(), 'tmp', uuid, 'knot', 'target')
  );
};

const getKnotsFolder = () => {
  if (process.env.NODE_ENV === 'test') {
    return path.resolve(getApplicationFolder(), 'knotsTestFolder');
  }
  return path.resolve(getApplicationFolder(), 'knots');
};

const getTemporaryKnotFolder = (uuid) =>
  path.resolve(getApplicationFolder(), 'tmp', uuid, 'knot');

const readFile = (filePath) =>
  new Promise((resolve, reject) => {
    // Return contents of specified file as a string
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (!err) {
        resolve(data);
      }
      reject(err);
    });
  });

const writeFile = (filePath, content) =>
  new Promise((resolve, reject) => {
    // Write the content specified to the specified file
    fs.writeFile(filePath, content, (error) => {
      if (!error) {
        resolve();
      }

      reject(error);
    });
  });

const addKnotAttribute = (content, knotPath, uuid) =>
  new Promise((resolve, reject) => {
    const pathToKnot =
      knotPath || path.resolve(getTemporaryKnotFolder(uuid), 'knot.json');
    readFile(pathToKnot)
      .then((knotObjectString) => {
        try {
          // Try to turn to object to validate it's a valid object
          const knotObject = JSON.parse(knotObjectString);

          const newKnot = set(knotObject, content.field, content.value);

          writeFile(pathToKnot, JSON.stringify(newKnot))
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        } catch (error) {
          // Not a valid object, pass on the error
          reject(error);
        }
      })
      .catch(reject);
  });

const createMakeFileCommands = (knot) => {
  const tapVersion = knot.tap.image.split(':')[1];
  const targetVersion = knot.target.image.split(':')[1];
  const { usesCatalogArg = true } = knot.tap.specImplementation || {};
  /* eslint-disable no-template-curly-in-string */
  return `SHELL=/bin/bash -o pipefail\n\nTAP=${
    knot.tap.name
  }\nTAP_VERSION=${tapVersion}\nTAP_IMAGE=${knot.tap.image}\nTARGET=${
    knot.target.name
  }\nTARGET_VERSION=${targetVersion}\nTARGET_IMAGE=${knot.target.image}\n${
    os.EOL
  }full-sync:${
    os.EOL
  }\t-\tdocker run -v "$(CURDIR)/tap:/app/tap/data" --interactive $(TAP_IMAGE) $(TAP) -c tap/data/config.json ${
    usesCatalogArg ? '--catalog' : '--properties'
  } tap/data/catalog.json | docker run -v "$(CURDIR)/target:/app/target/data" --interactive $(TARGET_IMAGE) $(TARGET) -c target/data/config.json > tap/state.json\n${
    os.EOL
  }sync:${
    os.EOL
  }\tif [ ! -f tap/latest-state.json ]; then touch tap/latest-state.json; fi${
    os.EOL
  }\ttail -1 "tap/state.json" > "tap/latest-state.json"; \\${
    os.EOL
  }\tdocker run -v "$(CURDIR)/tap:/app/tap/data" --interactive $(TAP_IMAGE) $(TAP) -c tap/data/config.json ${
    usesCatalogArg ? '--catalog' : '--properties'
  } tap/data/catalog.json --state tap/data/latest-state.json | docker run -v "$(CURDIR)/target:/app/target/data" --interactive $(TARGET_IMAGE) $(TARGET) -c target/data/config.json > tap/state.json\n${
    os.EOL
  }setup-py-envs:${os.EOL}\tpython3 -m venv venvs/tap${
    os.EOL
  }\tpython3 -m venv venvs/target${
    os.EOL
  }\tvenvs/tap/bin/pip install $(TAP)==$(TAP_VERSION)${
    os.EOL
  }\tvenvs/target/bin/pip install $(TARGET)==$(TARGET_VERSION)\n${
    os.EOL
  }py-full-sync:${os.EOL}\tvenvs/tap/bin/$(TAP) -c tap/config.json ${
    usesCatalogArg ? '--catalog' : '--properties'
  } tap/catalog.json | venvs/target/bin/$(TARGET) -c target/config.json > tap/state.json\n${
    os.EOL
  }py-sync:${
    os.EOL
  }\tif [ ! -f tap/latest-state.json ]; then touch tap/latest-state.json; fi${
    os.EOL
  }\ttail -1 "tap/state.json" > "tap/latest-state.json"; \\${
    os.EOL
  }\tvenvs/tap/bin/$(TAP) -c tap/config.json ${
    usesCatalogArg ? '--catalog' : '--properties'
  } tap/catalog.json --state tap/latest-state.json | venvs/target/bin/$(TARGET) -c target/config.json > tap/state.json`;
};
/* eslint-disable no-template-curly-in-string */

module.exports = {
  getApplicationFolder,
  getKnotsFolder,
  readFile,
  writeFile,
  addKnotAttribute,
  createTemporaryKnotFolder,
  getTemporaryKnotFolder,
  createMakeFileCommands
};
