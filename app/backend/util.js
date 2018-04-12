const fs = require('fs');
const { spawn, exec } = require('child_process');
const path = require('path');
const { set } = require('lodash');
const shell = require('shelljs');
const { app } = require('electron');

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

const addTap = (tap, version) =>
  new Promise((resolve, reject) => {
    const installTap = spawn('docker', ['run', 'gbolahan/tap-redshift:b4']);
    installTap.on('close', () => {
      createKnot(tap, version)
        .then(resolve)
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

const readSchema = () =>
  new Promise((resolve, reject) => {
    readFile(path.resolve(tempFolder, 'docker', 'tap', 'catalog.json'))
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

const sync = (req) =>
  new Promise((resolve) => {
    const syncData = exec(commands.runSync(tempFolder));
    syncData.stderr.on('data', (data) => {
      req.io.emit('live-sync-logs', data.toString());
    });
    syncData.error.on('data', (error) => {
      resolve(error.toString());
    });
    syncData.stdout.on('data', (data) => {
      resolve(data.toString());
    });
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
  sync
};
