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
  tapRedshiftDockerCommand,
  targetDataWorldDockerCommand
} = require('./constants');

let tempFolder;

// app is only defined in the packaged app, use app root directory during development
if (app) {
  tempFolder = app.getPath('home');
} else {
  tempFolder = path.resolve(__dirname, '..', '..');
}

const getKnots = () =>
  new Promise((resolve, reject) => {
    try {
      const knots = fs.readdirSync(path.resolve(tempFolder, 'knots'));

      resolve(knots);
    } catch (err) {
      reject(err);
    }
  });

const getTaps = () =>
  new Promise((resolve, reject) => {
    if (taps) {
      resolve(taps);
    } else {
      reject();
    }
  });

const detectDocker = () =>
  new Promise((resolve, reject) => {
    // Run `docker -v` on the user's shell
    const docker = spawn('docker', ['-v']);

    // A version number was returned, docker is installed
    docker.stdout.on('data', (version) => {
      resolve(version.toString('utf8'));
    });

    // Threw error, no Docker
    docker.on('error', () => {
      reject();
    });
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
    const installTap = spawn('docker', ['run', 'gbolahan/tap-redshift:b4']);
    installTap.on('close', () => {
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
  });

const writeConfig = (req) =>
  new Promise((resolve, reject) => {
    const { config } = req.body;
    writeFile(path.resolve(tempFolder, 'config.json'), JSON.stringify(config))
      .then(() => {
        shell.rm('-rf', path.resolve(tempFolder, 'docker', 'tap'));
        shell.mkdir('-p', path.resolve(tempFolder, 'docker', 'tap'));
        shell.mv(
          path.resolve(tempFolder, 'config.json'),
          path.resolve(tempFolder, 'docker', 'tap')
        );

        shell.rm('-rf', path.resolve(tempFolder, 'docker', 'images', 'tap'));
        shell.mkdir('-p', path.resolve(tempFolder, 'docker', 'images', 'tap'));
        writeFile(
          path.resolve(tempFolder, 'docker', 'images', 'tap', 'Dockerfile'),
          tapRedshiftDockerCommand
        )
          .then(() => {
            exec(commands.runDiscovery(tempFolder), (error, stdout, stderr) => {
              if (error || stderr) {
                let cmdOutput;
                try {
                  cmdOutput = error.toString();
                } catch (err) {
                  cmdOutput = stderr.toString();
                } finally {
                  req.io.emit('live-logs', cmdOutput);
                }
              } else {
                resolve();
              }
            });
          })
          .catch(reject);
      })
      .catch(reject);
  });

const readSchema = (knot) =>
  new Promise((resolve, reject) => {
    let knotPath;
    if (knot) {
      knotPath = path.resolve(
        tempFolder,
        'knots',
        knot,
        'docker',
        'tap',
        'catalog.json'
      );
    } else {
      knotPath = path.resolve(tempFolder, 'docker', 'tap', 'catalog.json');
    }
    readFile(knotPath)
      .then(resolve)
      .catch(reject);
  });

const getSchema = (req) =>
  new Promise((resolve, reject) => {
    writeConfig(req)
      .then(() => {
        readSchema()
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });

const addSchema = (req) =>
  new Promise((resolve, reject) => {
    const { config } = req.body;
    addKnotAttribute(['tap', 'config'], config)
      .then(() => {
        getSchema(req)
          .then(resolve)
          .catch(reject);
      })
      .catch((err) => {
        reject(err);
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
    const installTarget = spawn('docker', [
      'run',
      'gbolahan/target-datadotworld:1.0.0b3'
    ]);
    const val = {
      name: targetName,
      version
    };
    installTarget.on('close', () => {
      addKnotAttribute(['target'], val)
        .then(resolve)
        .catch(reject);
    });
  });

const addTargetConfig = (config) =>
  new Promise((resolve) => {
    shell.rm('-rf', path.resolve(tempFolder, 'docker', 'images', 'target'));
    shell.mkdir('-p', path.resolve(tempFolder, 'docker', 'images', 'target'));
    writeFile(
      path.resolve(tempFolder, 'docker', 'images', 'target', 'Dockerfile'),
      targetDataWorldDockerCommand
    )
      .then(() => {
        writeFile(
          path.resolve(tempFolder, 'config.json'),
          JSON.stringify(config)
        )
          .then(() => {
            shell.rm('-fr', path.resolve(tempFolder, 'docker', 'target'));
            shell.mkdir('-p', path.resolve(tempFolder, 'docker', 'target'));
            shell.mv(
              path.resolve(tempFolder, 'config.json'),
              path.resolve(tempFolder, 'docker', 'target')
            );
            resolve();
          })
          .catch(console.log);
      })
      .catch(console.log);
  });

const sync = (req, knot, mode) =>
  new Promise((resolve) => {
    let knotPath;
    let syncData;

    if (knot) {
      knotPath = `${tempFolder}/knots/${knot}`;
    } else {
      knotPath = `${tempFolder}/docker`;
    }

    if (mode === 'full' || !knot) {
      syncData = exec(commands.runSync(knotPath));
    } else {
      syncData = exec(commands.runPartialSync(knotPath));
    }

    syncData.stderr.on('data', (data) => {
      req.io.emit('live-sync-logs', data.toString());
    });
    syncData.error.on('data', (error) => {
      resolve(error.toString());
    });
    syncData.stdout.on('data', (data) => {
      resolve(data.toString());
    });
    syncData.on('exit', (code) => {
      req.io.emit('complete', 'Finished emitting');
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

const saveKnot = (name) =>
  new Promise((resolve) => {
    createMakefile();
    shell.mkdir('-p', path.resolve(tempFolder, 'knots', name));
    shell.mkdir('-p', path.resolve(tempFolder, 'knots', name, 'images'));
    shell.mv(
      path.resolve(tempFolder, 'docker', 'tap'),
      path.resolve(tempFolder, 'knots', name, 'tap')
    );
    shell.mv(
      path.resolve(tempFolder, 'docker', 'target'),
      path.resolve(tempFolder, 'knots', 'name', 'target')
    );
    shell.mv(
      path.resolve(tempFolder, 'knot.json'),
      path.resolve(tempFolder, 'knots', name, 'knots.json')
    );
    shell.mv(
      path.resolve(tempFolder, 'state.json'),
      path.resolve(tempFolder, 'knots', name, 'tap', 'state.json')
    );
    shell.mv(
      path.resolve(tempFolder, 'Makefile'),
      path.resolve(tempFolder, 'knots', name, 'Makefile')
    );
    shell.cp(
      '-R',
      path.resolve(tempFolder, 'docker', 'images'),
      path.resolve(tempFolder, 'knots', name)
    );

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
    console.log('The knot', knot);
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
  addSchema,
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
