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

const fs = require('fs');
const { lstatSync, readdirSync } = require('fs');
const path = require('path');
const { exec, execFile } = require('child_process');
const { EOL } = require('os');
const shell = require('shelljs');
const { EasyZip } = require('easy-zip');
const { app } = require('electron');

const {
  getApplicationFolder,
  getKnotsFolder,
  readFile,
  addKnotAttribute,
  writeFile
} = require('./util');
const { commands } = require('./constants');

const isWindows = process.platform === 'win32';

let applicationFolder;
let runningProcess;
if (process.env.NODE_ENV === 'production') {
  // Knots stored on user's home path on packaged app
  applicationFolder = path.resolve(app.getPath('home'), '.knots');
} else {
  // Use the repo during development
  applicationFolder = path.resolve(__dirname, '../..');
}

const getKnots = () =>
  new Promise((resolve, reject) => {
    const knotsFolder = getKnotsFolder();

    try {
      const isDirectory = (source) => lstatSync(source).isDirectory();
      const getDirectories = (source) =>
        readdirSync(source)
          // Get all files and folders in knots directory
          .map((name) => path.join(source, name))
          // Filter out files to remain with directories
          .filter(isDirectory)
          // Get folder name from absolute path
          .map((folderPath) => path.basename(folderPath));

      // Array of knot names
      const knots = getDirectories(knotsFolder);

      // For each knot folder get the knot.json file
      const knotJsons = knots.map((knot) =>
        readFile(`${knotsFolder}/${knot}/knot.json`)
      );

      Promise.all(knotJsons)
        .then((values) => {
          const knotObjects = values.map((knotString) => {
            try {
              const knotObject = JSON.parse(knotString);
              return knotObject;
            } catch (error) {
              reject(error);
            }
            return '';
          });

          resolve(knotObjects);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });

const createMakeFile = (knot, name) =>
  new Promise((resolve, reject) => {
    const { specImplementation } = knot.tap;
    const { usesReplication: usesReplication = true } =
      specImplementation || {};
    /* eslint-disable no-template-curly-in-string */
    const fileContent = `SHELL=/bin/bash -o pipefail\n\nfullSync:${EOL}\t-\tdocker run -v "$(CURDIR)/tap:/app/tap/data" --interactive ${
      knot.tap.image
    } ${
      knot.tap.name
    } -c tap/data/config.json --properties tap/data/catalog.json | docker run -v "$(CURDIR)/target:/app/target/data" --interactive ${
      knot.target.image
    } ${knot.target.name} -c target/data/config.json > ./tap/state.json${EOL}${
      usesReplication
        ? `sync:${EOL}\tif [ ! -f ./tap/latest-state.json ]; then touch ./tap/latest-state.json; fi${EOL}\ttail -1 "$(CURDIR)/tap/state.json" > "$(CURDIR)/tap/latest-state.json"; \\${EOL}\tdocker run -v "$(CURDIR)/tap:/app/tap/data" --interactive ${
            knot.tap.image
          } ${
            knot.tap.name
          } -c tap/data/config.json --properties tap/data/catalog.json --state tap/data/latest-state.json | docker run -v "$(CURDIR)/target:/app/target/data" --interactive ${
            knot.target.image
          } ${knot.target.name} -c target/data/config.json > ./tap/state.json}`
        : ''
    }`;
    /* eslint-disable no-template-curly-in-string */

    writeFile(
      path.resolve(applicationFolder, 'knots', name, 'Makefile'),
      fileContent
    )
      .then(resolve)
      .catch(reject);
  });

const emitLogs = (req, tapLogPath, targetLogPath) => {
  fs.watchFile(tapLogPath, () => {
    execFile('cat', [tapLogPath], (error, stdout) => {
      req.io.emit('tapLog', stdout.toString());
    });
  });

  fs.watchFile(targetLogPath, () => {
    execFile('cat', [targetLogPath], (error, stdout) => {
      req.io.emit('targetLog', stdout.toString());
    });
  });
};

const sync = (req) =>
  new Promise((resolve, reject) => {
    const { knotName } = req.body;

    // Get the stored knot object
    readFile(
      path.resolve(`${applicationFolder}/knots/${knotName}`, 'knot.json')
    )
      .then((knotObjectString) => {
        try {
          const knotObject = JSON.parse(knotObjectString);
          const tapLogPath = `${path.resolve(
            `${applicationFolder}/knots/${knotName}`,
            'tap.log'
          )}`;
          const targetLogPath = `${path.resolve(
            `${applicationFolder}/knots/${req.body.knotName}`,
            'target.log'
          )}`;

          // Get tap and target from the knot object
          const shellOptions = !isWindows ? 'set -o pipefail;' : '';
          const commandOptions = { detached: true };
          if (!isWindows) commandOptions.shell = '/bin/bash';
          const syncData = exec(
            shellOptions +
              commands.runSync(
                `${applicationFolder}/knots/${knotName}`,
                knotObject.tap,
                knotObject.target
              ),
            commandOptions
          );

          runningProcess = syncData;

          emitLogs(req, tapLogPath, targetLogPath);

          syncData.on('exit', (code) => {
            if (code > 0) {
              reject(new Error('Sync failed'));
            } else {
              addKnotAttribute(
                { field: ['lastRun'], value: new Date().toISOString() },
                path.resolve(
                  `${applicationFolder}/knots/${knotName}`,
                  'knot.json'
                )
              )
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  reject(error);
                });
            }
          });
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });

const saveKnot = (name, currentName) =>
  new Promise((resolve, reject) => {
    // Rename knot folder if editing
    if (currentName) {
      shell.rm('-rf', path.resolve(applicationFolder, 'knots', currentName));

      shell.mv(
        path.resolve(applicationFolder, currentName),
        path.resolve(applicationFolder, 'knots', name)
      );
    }

    const pathToKnot = currentName
      ? path.resolve(`${applicationFolder}/knots/${name}`, 'knot.json')
      : path.resolve(applicationFolder, 'knot.json');

    addKnotAttribute({ field: ['name'], value: name }, pathToKnot)
      .then(() => {
        readFile(pathToKnot)
          .then((knotObjectString) => {
            try {
              const knotObject = JSON.parse(knotObjectString);
              if (!currentName) {
                // Create knots folder if it doesn't exist
                shell.mkdir(
                  '-p',
                  path.resolve(applicationFolder, 'knots', name)
                );

                // Move tap config to knot's folder
                shell.mv(
                  path.resolve(applicationFolder, 'configs', 'tap'),
                  path.resolve(applicationFolder, 'knots', name, 'tap')
                );

                // Move target config to knot's folder
                shell.mv(
                  path.resolve(applicationFolder, 'configs', 'target'),
                  path.resolve(applicationFolder, 'knots', name, 'target')
                );

                // Move knot.json to knot's folder
                shell.mv(
                  path.resolve(applicationFolder, 'knot.json'),
                  path.resolve(applicationFolder, 'knots', name, 'knot.json')
                );
              }

              // Add the make file to the folder
              createMakeFile(knotObject, name)
                .then(() => {
                  resolve();
                })
                .catch(reject);
            } catch (error) {
              reject(error);
            }
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });

const deleteKnot = (knot) =>
  new Promise((resolve) => {
    shell.rm('-rf', path.resolve(applicationFolder, 'knots', knot));
    resolve();
  });

const packageKnot = (knotName) =>
  new Promise((resolve, reject) => {
    try {
      const zip = new EasyZip();

      // Make a clone of the knot to be downloaded
      shell.cp(
        '-R',
        path.resolve(applicationFolder, 'knots', knotName),
        path.resolve(applicationFolder)
      );

      // Remove log files
      shell.rm('-rf', path.resolve(applicationFolder, knotName, 'tap.log'));
      shell.rm('-rf', path.resolve(applicationFolder, knotName, 'target.log'));

      // Create zip from clone
      zip.zipFolder(path.resolve(applicationFolder, knotName), () => {
        zip.writeToFile(`${applicationFolder}/${knotName}.zip`);

        // Done, clean up
        shell.rm('-rf', path.resolve(applicationFolder, knotName));
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });

const downloadKnot = (req, res) => {
  // eslint-disable-next-line
  const { knot } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.download(`${applicationFolder}/${knot}.zip`);
};

const partialSync = (req) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line
    const { knotName } = req.body;

    // Get the stored knot object
    readFile(
      path.resolve(`${applicationFolder}/knots/${knotName}`, 'knot.json')
    )
      .then((knotObjectString) => {
        try {
          const knotObject = JSON.parse(knotObjectString);
          const tapLogPath = `${path.resolve(
            `${applicationFolder}/knots/${knotName}`,
            'tap.log'
          )}`;
          const targetLogPath = `${path.resolve(
            `${applicationFolder}/knots/${knotName}`,
            'target.log'
          )}`;

          // Get tap and target from the knot object
          const shellOptions = !isWindows ? 'set -o pipefail;' : '';
          const commandOptions = { detached: true };
          if (!isWindows) commandOptions.shell = '/bin/bash';
          const syncData = exec(
            shellOptions +
              commands.runPartialSync(
                `${applicationFolder}/knots/${knotName}`,
                knotObject.tap,
                knotObject.target
              ),
            commandOptions
          );

          runningProcess = syncData;

          emitLogs(req, tapLogPath, targetLogPath);

          syncData.on('exit', (code) => {
            if (code > 0) {
              reject(new Error('Partial sync failed'));
            } else {
              addKnotAttribute(
                {
                  field: ['lastRun'],
                  value: new Date().toISOString()
                },
                path.resolve(
                  `${applicationFolder}/knots/${knotName}`,
                  'knot.json'
                )
              )
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  reject(error);
                });
            }
          });
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });

const loadValues = (knot) =>
  new Promise((resolve, reject) => {
    // Make a clone of the knot to be edited
    shell.cp(
      '-R',
      path.resolve(applicationFolder, 'knots', knot),
      path.resolve(applicationFolder)
    );

    const knotPath = path.resolve(applicationFolder, knot);

    const promises = [
      readFile(`${knotPath}/knot.json`),
      readFile(`${knotPath}/tap/config.json`),
      readFile(`${knotPath}/tap/catalog.json`),
      readFile(`${knotPath}/target/config.json`)
    ];

    Promise.all(promises)
      .then((valueStrings) => {
        const values = valueStrings.map((valueString) => {
          try {
            const value = JSON.parse(valueString);

            return value;
          } catch (error) {
            reject(error);
          }

          return {};
        });

        const knotJson = values[0];
        const tapConfig = values[1];
        const schema = values[2].streams;
        const targetConfig = values[3];

        resolve({
          name: knotJson.name,
          tap: knotJson.tap,
          target: knotJson.target,
          tapConfig,
          targetConfig,
          schema
        });
      })
      .catch(reject);
  });

const terminateSync = () => {
  if (runningProcess) {
    return runningProcess.pid;
  }
};

const cancel = (knot) =>
  new Promise((resolve, reject) => {
    try {
      if (knot) {
        shell.rm('-rf', path.resolve(applicationFolder, knot));
      } else {
        shell.rm('-rf', path.resolve(applicationFolder, 'configs'));
        shell.rm('-rf', path.resolve(applicationFolder, 'knot.json'));
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  getApplicationFolder,
  getKnotsFolder,
  getKnots,
  saveKnot,
  sync,
  deleteKnot,
  packageKnot,
  downloadKnot,
  partialSync,
  loadValues,
  terminateSync,
  cancel
};
