const fs = require('fs');
const { lstatSync, readdirSync } = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { EOL } = require('os');
const shell = require('shelljs');
const { EasyZip } = require('easy-zip');
const { app } = require('electron');

const { readFile, addKnotAttribute, writeFile } = require('./util');
const { commands, getTapFields } = require('./constants');

let applicationFolder;
if (process.env.NODE_ENV === 'production') {
  // Knots stored on user's home path on packaged app
  applicationFolder = path.resolve(app.getPath('home'), 'knots');
} else {
  // Use the repo during development
  applicationFolder = path.resolve(__dirname, '../..');
}

const getKnots = () =>
  new Promise((resolve, reject) => {
    const knotsFolder = path.resolve(applicationFolder, 'knots');
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

      const knots = getDirectories(knotsFolder);

      // For each folder get the knot.json file
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
    /* eslint-disable no-template-curly-in-string */
    const fileContent = `install:${EOL}\t-\tdocker run ${
      knot.tap.image
    }${EOL}\t-\tdocker run ${
      knot.target.image
    }${EOL}fullSync:${EOL}\t-\tdocker run -v ${'${CURDIR}'}/tap:/app/tap/data --interactive ${
      knot.tap.image
    } ${
      knot.tap.name
    } -c tap/data/config.json --properties tap/data/catalog.json | docker run -v ${'${CURDIR}'}/target:/app/target/data --interactive ${
      knot.target.image
    } ${
      knot.target.name
    } -c target/data/config.json > ./tap/state.json${EOL}sync:${EOL}\t-\tdocker run -v ${'${CURDIR}'}/tap:/app/tap/data --interactive ${
      knot.tap.image
    } ${
      knot.tap.name
    } -c tap/data/config.json --properties tap/data/catalog.json --state tap/data/state.json | docker run -v ${'${CURDIR}'}/target:/app/target/data --interactive ${
      knot.target.image
    } ${
      knot.target.name
    } -c target/data/config.json > /tmp/state.json${EOL}\t-\tcp /tmp/state.json ./tap/state.json`;
    /* eslint-disable no-template-curly-in-string */

    writeFile(
      path.resolve(applicationFolder, 'knots', name, 'Makefile'),
      fileContent
    )
      .then(resolve)
      .catch(reject);
  });

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
          const tapLogPath = path.resolve(
            `${applicationFolder}/knots/${req.body.knotName}`,
            'tap.log'
          );
          const targetLogPath = path.resolve(
            `${applicationFolder}/knots/${req.body.knotName}`,
            'target.log'
          );

          // Get tap and target from the knot object
          const syncData = exec(
            commands.runSync(
              `${applicationFolder}/knots/${req.body.knotName}`,
              knotObject.tap,
              knotObject.target
            )
          );

          fs.watchFile(tapLogPath, () => {
            exec(`tail -n 1 ${tapLogPath}`, (error, stdout) => {
              req.io.emit('tapLog', stdout.toString());
            });
          });

          fs.watchFile(targetLogPath, () => {
            exec(`tail -n 1 ${targetLogPath}`, (error, stdout) => {
              req.io.emit('targetLog', stdout.toString());
            });
          });

          syncData.on('exit', () => {
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
          });
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });

const saveKnot = (name) =>
  new Promise((resolve, reject) => {
    addKnotAttribute({ field: ['name'], value: name })
      .then(() => {
        readFile(path.resolve(applicationFolder, 'knot.json'))
          .then((knotObjectString) => {
            try {
              const knotObject = JSON.parse(knotObjectString);
              // Create knots folder if it doesn't exist
              shell.mkdir('-p', path.resolve(applicationFolder, 'knots', name));

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
  new Promise((resolve) => {
    const zip = new EasyZip();
    zip.zipFolder(path.resolve(applicationFolder, 'knots', knotName), () => {
      zip.writeToFile(`${applicationFolder}/${knotName}.zip`);
      resolve();
    });
  });

const downloadKnot = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.download(`${applicationFolder}/${req.query.knot}.zip`);
};

const partialSync = (req) =>
  new Promise((resolve, reject) => {
    const { knotName } = req.body;

    // Get the stored knot object
    readFile(
      path.resolve(`${applicationFolder}/knots/${knotName}`, 'knot.json')
    )
      .then((knotObjectString) => {
        try {
          const knotObject = JSON.parse(knotObjectString);
          const tapLogPath = path.resolve(
            `${applicationFolder}/knots/${req.body.knotName}`,
            'tap.log'
          );
          const targetLogPath = path.resolve(
            `${applicationFolder}/knots/${req.body.knotName}`,
            'target.log'
          );

          // Get tap and target from the knot object
          const syncData = exec(
            commands.runPartialSync(
              `${applicationFolder}/knots/${req.body.knotName}`,
              knotObject.tap,
              knotObject.target
            )
          );

          fs.watchFile(tapLogPath, () => {
            exec(`tail -n 1 ${tapLogPath}`, (error, stdout) => {
              req.io.emit('tapLog', stdout.toString());
            });
          });

          fs.watchFile(targetLogPath, () => {
            exec(`tail -n 1 ${targetLogPath}`, (error, stdout) => {
              req.io.emit('targetLog', stdout.toString());
            });
          });

          syncData.on('exit', () => {
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
          });
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });

const loadValues = (knot) =>
  new Promise((resolve, reject) => {
    const knotPath = path.resolve(applicationFolder, 'knots', knot);

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
        const schema = values[2];
        const targetConfig = values[3];
        const tapFields = getTapFields(knotJson.tap.name);

        resolve({
          tap: knotJson.tap,
          target: knotJson.target,
          tapFields,
          tapConfig,
          targetConfig,
          schema
        });
      })
      .catch(reject);
  });

module.exports = {
  getKnots,
  saveKnot,
  sync,
  deleteKnot,
  packageKnot,
  downloadKnot,
  partialSync,
  loadValues
};
