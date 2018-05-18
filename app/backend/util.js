const fs = require('fs');
const { spawn, exec } = require('child_process');
const path = require('path');
const { set } = require('lodash');
const shell = require('shelljs');
const { app } = require('electron');
const { EasyZip } = require('easy-zip');

const {
  taps,
  commands,
  targets,
  tapRedshiftFields,
  tapSalesforceFields
} = require('./constants');

let tempFolder;

// app is only defined in the packaged app, use app root directory during development
if (process.env.NODE_ENV === 'production') {
  tempFolder = app.getPath('home');
} else {
  tempFolder = path.resolve(__dirname, '..', '..');
}

const detectDocker = () =>
  new Promise((resolve, reject) => {
    // Run `docker -v` on the user's shell
    const docker = spawn('docker', ['-v']);

    // A version number was returned, docker is installed
    docker.stdout.on('data', (version) => {
      resolve(version.toString('utf8'));
    });

    // Threw error, no Docker
    docker.on('error', (error) => {
      reject(error.toString('utf8'));
    });
  });

const getTaps = () =>
  new Promise((resolve, reject) => {
    if (taps) {
      resolve(taps);
    } else {
      reject();
    }
  });

const fetchTapFields = (tap, image) =>
  new Promise((resolve, reject) => {
    createKnot(tap, image)
      .then(() => {
        switch (tap) {
          case 'tap-redshift':
            resolve(tapRedshiftFields);
            break;
          case 'tap-salesforce':
            resolve(tapSalesforceFields);
            break;
          default:
            reject(new Error('Unknown tap'));
        }
      })
      .catch(reject);
  });

const getKnots = () =>
  new Promise((resolve, reject) => {
    try {
      const knots = fs.readdirSync(`${tempFolder}/knots`);
      console.log('The knots', knots);
      const knotJsons = knots.map((knot) =>
        readFile(`${tempFolder}/knots/${knot}/knot.json`)
      );
      Promise.all(knotJsons)
        .then((values) => {
          resolve(values);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });

const writeFile = (filePath, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (!err) {
        resolve();
      }

      reject();
    });
  });

const readFile = (filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (!err) {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      }
      reject(err);
    });
  });

const addKnotAttribute = (attributeArray, value) =>
  new Promise((resolve, reject) => {
    readFile(path.resolve(tempFolder, 'knot.json'))
      .then((knotObject) => {
        const newKnot = set(knotObject, attributeArray, value);

        writeFile(
          path.resolve(tempFolder, 'knot.json'),
          JSON.stringify(newKnot)
        )
          .then(() => {
            resolve();
          })
          .catch(reject);
      })
      .catch(reject);
  });

const createKnot = (tapName, tapImage) =>
  new Promise((resolve, reject) => {
    writeFile(
      path.resolve(tempFolder, 'knot.json'),
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
  });

const writeConfig = (config) =>
  new Promise((resolve, reject) => {
    writeFile(path.resolve(tempFolder, 'config.json'), JSON.stringify(config))
      .then(() => {
        shell.rm('-rf', path.resolve(tempFolder, 'configs', 'tap'));
        shell.mkdir('-p', path.resolve(tempFolder, 'configs', 'tap'));
        shell.mv(
          path.resolve(tempFolder, 'config.json'),
          path.resolve(tempFolder, 'configs', 'tap')
        );
        resolve();
      })
      .catch(reject);
  });

const getSchema = (req) =>
  new Promise((resolve, reject) => {
    const runDiscovery = exec(
      commands.runDiscovery(tempFolder, req.body.tap.name, req.body.tap.image)
    );

    runDiscovery.stderr.on('data', (data) => {
      req.io.emit('schemaLog', data.toString());
    });

    runDiscovery.on('exit', (code) => {
      if (code > 0) {
        reject(
          new Error(
            `${commands.runDiscovery(
              tempFolder,
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
    const knotPath = path.resolve(tempFolder, 'configs', 'tap', 'catalog.json');
    readFile(knotPath)
      .then((schema) => {
        // Stringify to turn back to object later
        const schemaString = JSON.stringify(schema);
        try {
          // Try to turn to object to validate it's a valid object
          JSON.parse(schemaString);

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
    // Write the config to configs/tap/
    writeConfig(req.body.tapConfig)
      .then(() => {
        // Get tap schema by running discovery mode
        getSchema(req)
          .then(() => {
            // Schema now on file, read it and return the result
            readSchema()
              .then(resolve)
              .catch(reject);
          })
          .catch(reject);
      })
      .catch(reject);
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
    addKnotAttribute(['target'], target)
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
  new Promise((resolve) => {
    const syncData = exec(
      commands.runSync(
        `${tempFolder}/knots/${req.body.knotName}`,
        req.body.tap,
        req.body.target
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
      resolve();
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
    addKnotAttribute(['name'], name)
      .then(() => {
        addKnotAttribute(['lastRun'], new Date().toISOString())
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
  getKnots,
  getTaps,
  detectDocker,
  fetchTapFields,
  addConfig,
  readSchema,
  writeSchema,
  getTargets,
  addTarget,
  addTargetConfig,
  sync,
  saveKnot,
  downloadKnot,
  getToken,
  deleteKnot
};
