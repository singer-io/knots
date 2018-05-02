const fs = require('fs');
const { spawn, exec } = require('child_process');
const path = require('path');
const { set } = require('lodash');
const shell = require('shelljs');
const { app } = require('electron');
const { EasyZip } = require('easy-zip');

const { taps, commands, targets, tapRedshiftFields } = require('./constants');

let tempFolder;

const KNOT_CONTENT = ['tap', 'target', 'knots.json', 'Makefile'];
const KNOT_TAP_CONTENT = ['config.json', 'state.json', 'catalog.json'];
const KNOT_TARGET_CONTENT = ['config.json'];
const KNOT_JSON_KEYS = ['tap', 'target'];

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

const fetchTapFields = (tap) =>
  new Promise((resolve, reject) => {
    switch (tap) {
      case 'tap-redshift':
        resolve(tapRedshiftFields);
        break;
      default:
        reject(new Error('Unknown tap'));
    }
  });

const validateKnotsFolder = (knotPath) =>
  new Promise((resolve, reject) => {
    const validKnotFolder = [];
    fs.lstat(knotPath, (error, knots) => {
      if (error) reject(error);

      if (knots.isDirectory()) {
        try {
          fs.readdir(knotPath, (e, savedKnots) => {
            savedKnots.forEach((folder) => {
              validKnotFolder.push(folder);
            });
            resolve(validKnotFolder);
          });
        } catch (e) {
          reject(e);
        }
      } else {
        reject();
      }
    });
  });

const validateKnotContent = (validKnots) =>
  new Promise((resolve, reject) => {
    const knots = [];
    try {
      validKnots.forEach((knotFolder) => {
        const pathToKnot = path.resolve(tempFolder, 'knots', knotFolder);
        const knotContent = fs.readdirSync(pathToKnot);
        if (knotContent.sort().join(',') === KNOT_CONTENT.sort().join(',')) {
          knots.push(pathToKnot);
        }
      });
      resolve(knots);
    } catch (e) {
      reject(e);
    }
  });

const validateKnotJson = (validKnotPaths) =>
  new Promise((resolve, reject) => {
    const knots = [];
    let counter = 0;
    validKnotPaths.forEach((knotPath) => {
      fs.readFile(path.resolve(knotPath, 'knots.json'), 'utf8', (e, data) => {
        if (e) reject(e);
        const knotConfig = JSON.parse(data);
        KNOT_JSON_KEYS.every((k) => {
          counter += 1;
          if (k in knotConfig) {
            knots.push(knotPath);
          } else {
            console.log('Missing keys in knot.json');
          }
          if (counter === validKnotPaths.length) {
            resolve(knots);
          }
        });
      });
    });
  });

const validateKnotTapContent = (validKnotPaths) =>
  new Promise((resolve, reject) => {
    const knots = [];
    let counter = 0;
    validKnotPaths.forEach((knotPath) => {
      fs.readdir(path.resolve(knotPath, 'tap'), (e, tapContent) => {
        if (e) reject(e);
        try {
          counter += 1;
          if (
            tapContent.sort().join(',') === KNOT_TAP_CONTENT.sort().join(',')
          ) {
            knots.push(knotPath);
          } else {
            console.log('Tap does not have the required files');
          }
          if (counter === validKnotPaths.length) {
            resolve(knots);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  });

const validateKnotTargetContent = (validKnotPaths) =>
  new Promise((resolve, reject) => {
    const validKnots = [];
    let counter = 0;
    validKnotPaths.forEach((knotPath) => {
      fs.readdir(path.resolve(knotPath, 'target'), (e, targetContent) => {
        if (e) reject(e);
        try {
          counter += 1;
          const folder = path.basename(knotPath);
          if (
            targetContent.sort().join(',') ===
            KNOT_TARGET_CONTENT.sort().join(',')
          ) {
            validKnots.push(folder);
          } else {
            console.log(
              `knot ${folder} could not be retrieved: No target config.json`
            );
          }
          if (counter === validKnotPaths.length) {
            resolve(validKnots);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  });

async function getKnots() {
  try {
    const knotPath = path.resolve(tempFolder, 'knots');
    const data = await validateKnotsFolder(knotPath);
    const file = await validateKnotContent(data);
    const config = await validateKnotJson(file);
    const paths = await validateKnotTapContent(config);
    const validKnot = await validateKnotTargetContent(paths);
    return new Promise((resolve) => {
      resolve(validKnot);
    });
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
}

const writeFile = (filePath, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (!err) {
        resolve();
      }

      reject();
    });
  });

const getTapConfig = () =>
  new Promise((resolve) => {
    // Hard code for now
    resolve([
      { key: 'host', label: 'Hostname', required: true },
      { key: 'user', label: 'User name', required: true },
      { key: 'password', label: 'Password', required: true },
      { key: 'dbname', label: 'Database', required: true },
      { key: 'port', label: 'Port', required: true },
      { key: 'schema', label: 'Schema', required: false }
    ]);
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

const createKnot = (tapName, tapVersion) =>
  new Promise((resolve, reject) => {
    writeFile(
      path.resolve(tempFolder, 'knot.json'),
      JSON.stringify({
        tap: {
          name: tapName,
          version: tapVersion
        }
      })
    )
      .then(() => {
        getTapConfig(tapName)
          .then((config) => {
            addKnotAttribute(['tap', 'config'], config)
              .then(() => {
                resolve(config);
              })
              .catch(reject);
          })
          .catch(reject);
      })
      .catch(reject);
  });

const readFieldValues = (knot) =>
  new Promise((resolve, reject) => {
    readFile(path.resolve(tempFolder, 'knots', knot, 'knots.json'))
      .then((knotObject) => {
        resolve(knotObject.tap.config);
      })
      .catch(reject);
  });

const addTap = (tap, version, knot) =>
  new Promise((resolve, reject) => {
    createKnot(tap, version)
      .then((config) => {
        if (knot) {
          readFieldValues(knot)
            .then((fieldValues) => {
              resolve({ config, fieldValues });
            })
            .catch(reject);
        } else {
          resolve(config);
        }
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

const getSchema = (tap) =>
  new Promise((resolve, reject) => {
    const runDiscovery = exec(commands.runDiscovery(tempFolder, tap));

    runDiscovery.stderr.on('data', (data) => {
      console.log('Err', data.toString());
    });

    runDiscovery.stdout.on('data', (data) => {
      console.log('OUT', data.toString());
    });

    runDiscovery.on('exit', (code) => {
      console.log('Done', code.toString());
      if (code > 0) {
        reject(new Error('Failed to run discovery'));
      } else {
        resolve();
      }
    });
  });

const readSchema = () =>
  new Promise((resolve, reject) => {
    const knotPath = path.resolve(tempFolder, 'configs', 'tap', 'catalog.json');
    readFile(knotPath)
      .then(resolve)
      .catch(reject);
  });

const addConfig = (tap, config) =>
  new Promise((resolve, reject) => {
    // Write the config to configs/tap/
    writeConfig(config)
      .then(() => {
        // Get tap schema by running discovery mode
        getSchema(tap)
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
          path.resolve(tempFolder, 'docker', 'tap', 'catalog.json')
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

const addTarget = (targetName, version) =>
  new Promise((resolve, reject) => {
    const val = {
      name: targetName,
      version
    };
    addKnotAttribute(['target'], val)
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

const sync = () =>
  new Promise((resolve) => {
    const syncData = exec(commands.runSync(`${tempFolder}/configs`));

    syncData.stderr.on('data', (data) => {
      console.log('Err', data.toString());
    });

    syncData.stdout.on('data', (data) => {
      console.log('OUT', data.toString());
    });

    syncData.on('exit', (code) => {
      console.log('Done', code.toString());
      resolve();
    });
  });

const createMakefile = () =>
  new Promise((resolve, reject) => {
    // TODO: Refactor string interpolation for makefile content
    const fileContent =
      'install:\n' +
      '\t-' +
      '\tdocker run gbolahan/tap-redshift:1.0.0b3\n' +
      '\t-' +
      '\tdocker run gbolahan/target-datadotworld:1.0.0b3\n' +
      'fullSync:\n' +
      '\tdocker run -v ${CURDIR}' +
      '/tap:/app/tap/data --interactive gbolahan/tap-redshift:1.0.0b3 ' +
      'tap-redshift -c tap/data/config.json --properties tap/data/catalog.json | ' +
      'docker run -v ${CURDIR}' +
      '/target:/app/target/data --interactive gbolahan/target-datadotworld:1.0.0b3 ' +
      'target-datadotworld -c target/data/config.json > ./tap/state.json\n' +
      'sync:\n' +
      '\t-' +
      '\tdocker run -v ${CURDIR}' +
      '/tap:/app/tap/data --interactive gbolahan/tap-redshift:1.0.0b3 ' +
      'tap-redshift -c tap/data/config.json --properties tap/data/catalog.json ' +
      '--state tap/data/state.json | ' +
      'docker run -v ${CURDIR}' +
      '/target:/app/target/data --interactive gbolahan/target-datadotworld:1.0.0b3 ' +
      'target-datadotworld -c target/data/config.json > /tmp/state.json\n' +
      '\t-' +
      '\tcp /tmp/state.json ./tap/state.json';

    writeFile(path.resolve(tempFolder, 'Makefile'), fileContent)
      .then(resolve)
      .catch(reject);
  });

const validateIsDirectory = (pathToFolder) =>
  new Promise((resolve, reject) => {
    fs.lstat(pathToFolder, (err, file) => {
      if (file.isDirectory()) {
        resolve();
      } else {
        reject(err);
      }
    });
  });

const saveKnot = (name) =>
  new Promise((resolve, reject) => {
    createMakefile();

    shell.mkdir('-p', path.resolve(tempFolder, 'knots', name));

    const pathToDockerTapFolder = path.resolve(tempFolder, 'docker', 'tap');
    const pathToDockerTargetFolder = path.resolve(
      tempFolder,
      'docker',
      'target'
    );
    const pathToKnotJson = path.resolve(tempFolder, 'knot.json');

    validateIsDirectory(pathToDockerTapFolder)
      .then(() => {
        try {
          fs.readdir(pathToDockerTapFolder, (e, tapFolderContent) => {
            if (e) reject(e);
            if (
              tapFolderContent.sort().join(',') ===
              ['catalog.json', 'config.json'].sort().join(',')
            ) {
              shell.mv(
                pathToDockerTapFolder,
                path.resolve(tempFolder, 'knots', name, 'tap')
              );
            } else {
              reject();
            }
          });
        } catch (e) {
          reject(e);
        }
      })
      .catch((e) => {
        reject(e);
      });

    validateIsDirectory(pathToDockerTargetFolder)
      .then(() => {
        try {
          fs.readdir(pathToDockerTargetFolder, (e, targetFolderContent) => {
            if (e) reject(e);
            if (targetFolderContent === ['config.json']) {
              shell.mv(
                pathToDockerTargetFolder,
                path.resolve(tempFolder, 'knots', 'name', 'target')
              );
            } else {
              reject();
            }
          });
        } catch (e) {
          reject(e);
        }
      })
      .catch((e) => {
        reject(e);
      });

    fs.readdir(tempFolder, (e, files) => {
      if (e) reject(e);
      if ('knot.json' in files) {
        readFile(pathToKnotJson)
          .then((config) => {
            const knotConfig = JSON.parse(config);
            try {
              KNOT_JSON_KEYS.every((k) => {
                if (k in knotConfig) {
                  shell.mv(
                    pathToKnotJson,
                    path.resolve(tempFolder, 'knots', name, 'knots.json')
                  );
                } else {
                  reject();
                }
              });
            } catch (error) {
              reject(error);
            }
          })
          .catch(() => {
            reject(e);
          });
      }

      if ('Makefile' in files) {
        shell.mv(
          path.resolve(tempFolder, 'Makefile'),
          path.resolve(tempFolder, 'knots', name, 'Makefile')
        );
      }
    });
    resolve();
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

module.exports = {
  getKnots,
  getTaps,
  detectDocker,
  addTap,
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
  getToken
};
