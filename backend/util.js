const { spawn, exec } = require('child_process');
const fs = require('fs');
const shell = require('shelljs');
const { set } = require('lodash');
const { commands } = require('./constants');
const { EasyZip } = require('easy-zip');

const getKnots = () =>
  new Promise((resolve) => {
    const knots = fs.readdirSync('./knots');

    resolve(knots || []);
  });

const detectDocker = () =>
  new Promise((resolve, reject) => {
    // Run `docker -v` on the user's shell
    const docker = spawn('docker', ['-v']);

    // A version number was returned, docker is installed
    docker.stdout.on('data', () => {
      resolve();
    });

    // Threw error, no Docker
    docker.on('error', () => {
      reject();
    });
  });

const writeFile = (path, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
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

const readFile = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (!err) {
        resolve(JSON.parse(data));
      }
      reject(err);
    });
  });

const addKnotAttribute = (attributeArray, value) =>
  new Promise((resolve, reject) => {
    readFile('./knot.json').then((knotObject) => {
      const newKnot = set(knotObject, attributeArray, value);

      writeFile('./knot.json', JSON.stringify(newKnot))
        .then(() => {
          resolve();
        })
        .catch(reject);
    });
  });

const createKnot = (tapName, tapVersion) =>
  new Promise((resolve, reject) => {
    writeFile(
      './knot.json',
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
    createKnot(tap, version)
      .then(resolve)
      .catch(reject);
  });

const readSchema = () =>
  new Promise((resolve, reject) => {
    readFile('./docker/tap/catalog.json')
      .then(resolve)
      .catch(reject);
  });

const writeConfig = (req) =>
  new Promise((resolve, reject) => {
    const config = req.body;
    const configJson = {};
    config.forEach((field) => {
      configJson[field.key] = field.value;
    });
    writeFile('./config.json', JSON.stringify(configJson))
      .then(() => {
        shell.rm('-rf', './docker/tap');
        shell.mkdir('-p', './docker/tap');
        shell.mv('./config.json', './docker/tap');
        exec(commands.runDiscovery, (error, stdout, stderr) => {
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
  });

const getSchema = (req) =>
  new Promise((resolve, reject) => {
    writeConfig(req)
      .then(() => {
        readSchema()
          .then(resolve)
          .catch(reject);
      })
      .catch((err) => {
        reject(err);
      });
  });

const writeSchema = (schemaObject) =>
  new Promise((resolve, reject) => {
    writeFile('./catalog.json', JSON.stringify(schemaObject))
      .then(() => {
        shell.rm('-f', './docker/tap/catalog.json');
        shell.mv('./catalog.json', './docker/tap');
        resolve();
      })
      .catch(reject);
  });

const addSchema = (req) =>
  new Promise((resolve, reject) => {
    const config = req.body;
    addKnotAttribute(['tap', 'config'], config)
      .then(() => {
        readConfig();
        getSchema(req)
          .then(resolve)
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
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
  new Promise((resolve, reject) => {
    writeFile('./config.json', JSON.stringify(config))
      .then(() => {
        shell.rm('-fr', './docker/target');
        shell.mkdir('-p', './docker/target');
        shell.mv('./config.json', './docker/target');
        resolve();
      })
      .catch(reject);
  });

const sync = (req) =>
  new Promise((resolve) => {
    const syncData = exec(commands.runSync(req.body.knot));
    syncData.stderr.on('data', (data) => {
      req.io.emit('live-sync-logs', data.toString());
    });
    syncData.on('close', () => {
      resolve();
    });
  });

const createMakefile = () =>
  new Promise((resolve, reject) => {
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

    writeFile('Makefile', fileContent)
      .then(resolve)
      .catch(reject);
  });

const saveKnot = (name) =>
  new Promise((resolve) => {
    createMakefile();
    shell.mkdir('-p', `./knots/${name}`);
    shell.mkdir('-p', `./knots/${name}/images`);
    shell.mv('./docker/tap', `./knots/${name}/tap`);
    shell.mv('./docker/target', `./knots/${name}/target`);
    shell.mv('./knot.json', `./knots/${name}/knot.json`);
    shell.mv('./state.json', `./knots/${name}/tap/state.json`);
    shell.mv('./Makefile', `./knots/${name}/Makefile`);
    shell.cp('-R', './docker/images/', `./knots/${name}`);

    resolve();
  });

const downloadKnot = (knotName) =>
  new Promise((resolve) => {
    const zip = new EasyZip();
    zip.zipFolder(`./knots/${knotName}`, () => {
      zip.writeToFile(`${knotName}.zip`);
      resolve();
    });
  });

const readConfig = () =>
  new Promise((resolve, reject) => {
    readFile('./knot.json')
      .then((data) => {
        resolve(data.tap.config);
      })
      .catch(reject);
  });

module.exports = {
  getKnots,
  detectDocker,
  addTap,
  addSchema,
  addTarget,
  writeSchema,
  addTargetConfig,
  sync,
  saveKnot,
  downloadKnot,
  readConfig
};
