const { spawn } = require('child_process');
const fs = require('fs');

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

const writeKnot = (knotString) =>
  new Promise((resolve, reject) => {
    fs.writeFile('./knot.json', knotString, (err) => {
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

const readKnot = () =>
  new Promise((resolve, reject) => {
    fs.readFile('./knot.json', 'utf8', (err, data) => {
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
    readKnot().then((knotObject) => {
      const newKnot = extendObject(knotObject, attributeArray, value);

      writeKnot(JSON.stringify(newKnot))
        .then(resolve)
        .catch(reject);
    });
  });

const createKnot = (tapName, tapVersion) =>
  new Promise((resolve, reject) => {
    writeKnot(
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

module.exports = {
  getKnots,
  detectDocker,
  addTap
};
