const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { set } = require('lodash');
const shell = require('shelljs');
const { app } = require('electron');
const { EasyZip } = require('easy-zip');

const { commands, targets } = require('./constants');

let tempFolder;

// app is only defined in the packaged app, use app root directory during development
if (process.env.NODE_ENV === 'production') {
  tempFolder = app.getPath('home');
} else {
  tempFolder = path.resolve(__dirname, '..', '..');
}

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
    fs.writeFile(filePath, content, (err) => {
      if (!err) {
        resolve();
      }

      reject();
    });
  });

const addKnotAttribute = (content, passedPath) =>
  new Promise((resolve, reject) => {
    const pathToKnot = passedPath || path.resolve(tempFolder, 'knot.json');
    readFile(pathToKnot)
      .then((knotObject) => {
        const newKnot = set(knotObject, content.field, content.value);

        writeFile(pathToKnot, JSON.stringify(newKnot))
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });

const writeSchema = (schemaObject) =>
  new Promise((resolve, reject) => {
    writeFile(
      path.resolve(tempFolder, 'catalog.json'),
      JSON.stringify(schemaObject)
    )
      .then(() => {
        shell.rm(
          '-f',
          path.resolve(tempFolder, 'docker', 'tap', 'catalog.json')
        );
        shell.mv(
          path.resolve(tempFolder, 'catalog.json'),
          path.resolve(tempFolder, 'configs', 'tap')
        );
        resolve();
      })
      .catch(reject);
  });

const getTargets = () =>
  new Promise((resolve, reject) => {
    if (targets) {
      resolve(targets);
    } else {
      reject();
    }
  });

const addTarget = (target) =>
  new Promise((resolve, reject) => {
    addKnotAttribute({ field: ['target'], value: target })
      .then(resolve)
      .catch(reject);
  });

const addTargetConfig = (config) =>
  new Promise((resolve) => {
    writeFile(path.resolve(tempFolder, 'config.json'), JSON.stringify(config))
      .then(() => {
        shell.rm('-fr', path.resolve(tempFolder, 'configs', 'target'));
        shell.mkdir('-p', path.resolve(tempFolder, 'configs', 'target'));
        shell.mv(
          path.resolve(tempFolder, 'config.json'),
          path.resolve(tempFolder, 'configs', 'target')
        );
        resolve();
      })
      .catch(console.log);
  });

const sync = (req) =>
  new Promise((resolve, reject) => {
    const { knotName } = req.body;

    // Get the stored knot object
    readFile(path.resolve(`${tempFolder}/knots/${knotName}`, 'knot.json'))
      .then((knotObject) => {
        // Get tap and target from the knot object
        const syncData = exec(
          commands.runSync(
            `${tempFolder}/knots/${req.body.knotName}`,
            knotObject.tap,
            knotObject.target
          )
        );

        fs.watchFile('tap.log', () => {
          exec('tail -n 1 tap.log', (error, stdout) => {
            req.io.emit('tapLog', stdout.toString());
          });
        });

        fs.watchFile('target.log', () => {
          exec('tail -n 1 target.log', (error, stdout) => {
            req.io.emit('targetLog', stdout.toString());
          });
        });

        syncData.on('exit', (code) => {
          addKnotAttribute(
            { field: ['lastRun'], value: new Date().toISOString() },
            path.resolve(`${tempFolder}/knots/${knotName}`, 'knot.json')
          )
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        });
      })
      .catch((err) => {
        console.log('Bane', err);
      });
  });

const partialSync = (req) =>
  new Promise((resolve, reject) => {
    const { knotName } = req.body;

    // Get the stored knot object
    readFile(path.resolve(`${tempFolder}/knots/${knotName}`, 'knot.json'))
      .then((knotObject) => {
        // Get tap and target from the knot object
        const syncData = exec(
          commands.runPartialSync(
            `${tempFolder}/knots/${req.body.knotName}`,
            knotObject.tap,
            knotObject.target
          )
        );

        fs.watchFile('tap.log', () => {
          exec('tail -n 1 tap.log', (error, stdout) => {
            req.io.emit('tapLog', stdout.toString());
          });
        });

        fs.watchFile('target.log', () => {
          exec('tail -n 1 target.log', (error, stdout) => {
            req.io.emit('targetLog', stdout.toString());
          });
        });

        syncData.on('exit', (code) => {
          addKnotAttribute(
            {
              field: ['lastRun'],
              value: new Date().toISOString()
            },
            path.resolve(`${tempFolder}/knots/${knotName}`, 'knot.json')
          )
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        });
      })
      .catch((err) => {
        console.log('Bane', err);
      });
  });

const createMakeFile = (knot, name) =>
  new Promise((resolve, reject) => {
    const fileContent =
      'install:\n' +
      '\t-' +
      `\tdocker run ${knot.tap.image}\n` +
      '\t-' +
      `\tdocker run ${knot.target.image}\n` +
      'fullSync:\n' +
      '\tdocker run -v ${CURDIR}' +
      `/tap:/app/tap/data --interactive ${knot.tap.image} ` +
      `${
        knot.tap.name
      } -c tap/data/config.json --properties tap/data/catalog.json | ` +
      'docker run -v ${CURDIR}' +
      `/target:/app/target/data --interactive ${knot.target.image} ` +
      `${knot.target.name} -c target/data/config.json > ./tap/state.json\n` +
      'sync:\n' +
      '\t-' +
      '\tdocker run -v ${CURDIR}' +
      `/tap:/app/tap/data --interactive ${knot.tap.image} ` +
      `${
        knot.tap.name
      } -c tap/data/config.json --properties tap/data/catalog.json ` +
      '--state tap/data/state.json | ' +
      'docker run -v ${CURDIR}' +
      `/target:/app/target/data --interactive ${knot.target.image} ` +
      `${knot.target.name} -c target/data/config.json > /tmp/state.json\n` +
      '\t-' +
      '\tcp /tmp/state.json ./tap/state.json';

    writeFile(path.resolve(tempFolder, 'knots', name, 'Makefile'), fileContent)
      .then(resolve)
      .catch(reject);
  });

const saveKnot = (name) =>
  new Promise((resolve, reject) => {
    addKnotAttribute({ field: ['name'], value: name })
      .then(() => {
        readFile(path.resolve(tempFolder, 'knot.json'))
          .then((knotObject) => {
            try {
              // Create knots folder if it doesn't exist
              shell.mkdir('-p', path.resolve(tempFolder, 'knots', name));

              // Move tap config to knot's folder
              shell.mv(
                path.resolve(tempFolder, 'configs', 'tap'),
                path.resolve(tempFolder, 'knots', name, 'tap')
              );

              // Move target config to knot's folder
              shell.mv(
                path.resolve(tempFolder, 'configs', 'target'),
                path.resolve(tempFolder, 'knots', name, 'target')
              );

              // Move knot.json to knot's folder
              shell.mv(
                path.resolve(tempFolder, 'knot.json'),
                path.resolve(tempFolder, 'knots', name, 'knot.json')
              );

              createMakeFile(knotObject, name);

              resolve();
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

const downloadKnot = (knotName) =>
  new Promise((resolve) => {
    const zip = new EasyZip();
    zip.zipFolder(path.resolve(tempFolder, 'knots', knotName), () => {
      zip.writeToFile(`${knotName}.zip`);
      resolve();
    });
  });

const getToken = (knot) =>
  new Promise((resolve, reject) => {
    if (knot) {
      readFile(path.resolve(tempFolder, 'knots', knot, 'target', 'config.json'))
        .then((configObject) => resolve(configObject.api_token))
        .catch((err) => {
          reject(err);
        });
    } else {
      reject();
    }
  });

const deleteKnot = (knot) =>
  new Promise((resolve) => {
    shell.rm('-rf', path.resolve(tempFolder, 'knots', knot));
    resolve();
  });

module.exports = {
  writeSchema,
  getTargets,
  addTarget,
  addTargetConfig,
  sync,
  partialSync,
  saveKnot,
  downloadKnot,
  getToken,
  deleteKnot,
  readFile,
  writeFile
};
