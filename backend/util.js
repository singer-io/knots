const { spawn } = require('child_process');
const fs = require('fs');
const shell = require('shelljs');

const getKnots = () =>
  new Promise((resolve) => {
    // TODO: Read from knots folder and return result
    resolve([]);
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

const extendObject = (object, keyPath, value) => {
  let clone = object;
  const lastKeyIndex = keyPath.length - 1;
  for (let i = 0; i < lastKeyIndex; i += 1) {
    const key = keyPath[i];
    if (!(key in clone)) {
      clone[key] = {};
    }
    clone = clone[key];
  }

  clone[keyPath[lastKeyIndex]] = value;

  return clone;
};

const addKnotAttribute = (attributeArray, value) =>
  new Promise((resolve, reject) => {
    readFile('./knot.json').then((knotObject) => {
      const newKnot = extendObject(knotObject, attributeArray, value);

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
  new Promise((resolve) => {
    console.log('I am about to start');
    readFile('./docker/tap/config.json')
      .then((schemaObject) => {
        console.log('This is the object', schemaObject);
        resolve();
      })
      .catch((err) => console.log(err));
  });

const runDiscovery = () =>
  new Promise((resolve, reject) => {
    console.log('Inside discovery');
    const discovery = spawn('docker', [
      'run',
      '-v',
      '$(pwd)/docker/tap:/app/tap-redshift/data',
      'gbolahan/tap-redshift:1.0.0b3',
      'tap-redshift',
      '-c',
      'tap-redshift/data/config.json',
      '-d',
      '>',
      'docker/tap/catalog.json'
    ]);

    // A version number was returned, docker is installed
    discovery.on('close', () => {
      console.log('Inside close');
      resolve();
    });

    // Threw error, no Docker
    discovery.on('error', (err) => {
      console.log('Something went wrong', err);
      reject(err);
    });
  });

const writeConfig = (config) =>
  new Promise((resolve, reject) => {
    const configJson = {};
    config.forEach((field) => {
      configJson[field.key] = field.value;
    });
    writeFile('./config.json', JSON.stringify(configJson))
      .then(() => {
        console.log('Starting');
        shell.rm('-rf', './docker/tap');
        shell.mkdir('-p', './docker/tap');
        shell.mv('./config.json', './docker/tap');
        runDiscovery()
          .then(() => {
            console.log('Imefika hapa?');
            readSchema()
              .then(resolve)
              .catch(reject);
            resolve();
          })
          .catch(reject);
      })
      .catch(reject);
  });

const getSchema = (config) =>
  new Promise((resolve, reject) => {
    writeConfig(config)
      .then(resolve)
      .catch(reject);
  });

const addSchema = (config) =>
  new Promise((resolve, reject) => {
    addKnotAttribute(['config'], config)
      .then(() => {
        getSchema(config)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });

module.exports = {
  getKnots,
  detectDocker,
  addTap,
  addSchema
};
