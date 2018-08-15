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
const shell = require('shelljs');
const { EasyZip } = require('easy-zip');

const {
  getKnotsFolder,
  readFile,
  addKnotAttribute,
  writeFile,
  createMakeFileCommands,
  getApplicationFolder,
  getTemporaryKnotFolder,
  createTemporaryKnotFolder
} = require('./util');
const { commands } = require('./constants');

let runningProcess;

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

const sync = (req, mode) =>
  new Promise((resolve, reject) => {
    const { knotName } = req.body;
    const pathToKnot = path.resolve(getKnotsFolder(), knotName);

    readFile(path.resolve(pathToKnot, 'knot.json'))
      .then((knotObjectString) => {
        try {
          const knotObject = JSON.parse(knotObjectString);
          /* eslint-disable prefer-const */
          // "Assignment to constant variable" error when const is used
          // TODO: Investigate further
          let tapLogPath = path.resolve(pathToKnot, 'tap.log');
          let targetLogPath = path.resolve(pathToKnot, 'target.log');
          /* eslint-disable prefer-const */

          addKnotAttribute(
            { field: ['lastRun'], value: new Date().toISOString() },
            path.resolve(pathToKnot, 'knot.json')
          )
            .then(() => {
              const syncCommand =
                mode === 'partial'
                  ? commands.runPartialSync(
                      pathToKnot,
                      knotObject.tap,
                      knotObject.target
                    )
                  : commands.runSync(
                      pathToKnot,
                      knotObject.tap,
                      knotObject.target
                    );

              const runSync = exec(`set -o pipefail;${syncCommand}`, {
                detached: true,
                shell: '/bin/bash'
              });
              runningProcess = runSync;
              emitLogs(req, tapLogPath, targetLogPath);

              runSync.on('exit', (code) => {
                if (code > 0) {
                  reject(new Error('Sync failed'));
                } else {
                  resolve();
                }
              });

              runSync.on('error', () => {
                reject(new Error('Sync failed'));
              });
            })
            .catch((error) => {
              reject(error);
            });
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });

const saveKnot = (name, uuid, currentName) =>
  new Promise((resolve, reject) => {
    const pathToKnot = path.resolve(getTemporaryKnotFolder(uuid), 'knot.json');

    addKnotAttribute({ field: ['name'], value: name }, pathToKnot)
      .then(() => {
        readFile(pathToKnot)
          .then((knotObjectString) => {
            try {
              if (currentName) {
                // Remove the knot that has been edited
                shell.rm('-rf', path.resolve(getKnotsFolder(), currentName));
              }

              const knotObject = JSON.parse(knotObjectString);
              shell.mkdir('-p', path.resolve(getKnotsFolder(), name));
              shell.mv(
                path.resolve(getTemporaryKnotFolder(uuid), '*'),
                path.resolve(getKnotsFolder(), name)
              );

              shell.rm(
                '-rf',
                path.resolve(getApplicationFolder(), 'tmp', uuid)
              );

              // Add a make file to the folder
              writeFile(
                path.resolve(getKnotsFolder(), name, 'Makefile'),
                createMakeFileCommands(knotObject)
              )
                .then(resolve)
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
    shell.rm('-rf', path.resolve(getKnotsFolder(), knot));
    resolve();
  });

const packageKnot = (knotName) =>
  new Promise((resolve, reject) => {
    const knotPath = path.resolve(getKnotsFolder(), knotName);

    // Check if folder exists
    fs.access(knotPath, fs.constants.F_OK, (err) => {
      try {
        if (err) {
          throw new Error('Knot does not exist');
        }

        const zip = new EasyZip();
        const tempFolder = path.resolve(getApplicationFolder(), 'tmp');

        // Make a clone of the knot to be downloaded
        shell.cp('-R', path.resolve(knotPath), path.resolve(tempFolder));

        // Remove log files
        shell.rm('-rf', path.resolve(tempFolder, knotName, 'tap.log'));
        shell.rm('-rf', path.resolve(tempFolder, knotName, 'target.log'));

        // Create zip from clone
        zip.zipFolder(path.resolve(tempFolder, knotName), () => {
          zip.writeToFile(`${tempFolder}/${knotName}.zip`);

          // Done, clean up
          shell.rm('-rf', path.resolve(tempFolder, knotName));
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  });

const downloadKnot = (req, res) => {
  // eslint-disable-next-line
  const { knot } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.download(`${path.resolve(getApplicationFolder(), 'tmp')}/${knot}.zip`);
};

const loadValues = (knot, uuid) =>
  new Promise((resolve, reject) => {
    createTemporaryKnotFolder(uuid);
    // Make a clone of the knot to be edited
    shell.cp(
      '-R',
      path.resolve(getKnotsFolder(), knot, '*'),
      path.resolve(getTemporaryKnotFolder(uuid))
    );

    const knotPath = getTemporaryKnotFolder(uuid);

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

const loadKnot = (knot) =>
  new Promise((resolve, reject) => {
    const knotPath = path.resolve(getKnotsFolder(), knot, 'knot.json');

    readFile(knotPath)
      .then((knotString) => {
        try {
          const knotJson = JSON.parse(knotString);

          resolve({
            tap: knotJson.tap,
            target: knotJson.target
          });
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });

const terminateSync = () => {
  if (runningProcess) {
    return runningProcess.pid;
  }
};

const cancel = (uuid) =>
  new Promise((resolve, reject) => {
    try {
      shell.rm('-rf', getTemporaryKnotFolder(uuid));
      resolve();
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  getKnots,
  saveKnot,
  sync,
  deleteKnot,
  packageKnot,
  downloadKnot,
  loadValues,
  loadKnot,
  terminateSync,
  cancel
};
