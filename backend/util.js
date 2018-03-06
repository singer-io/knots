const { spawn } = require('child_process');
const fs = require('fs');

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

const installTap = (selected_tap) =>
  new Promise((resolve, reject) => {
    const capitalized_tap_name = selected_tap.toUpperCase();
    const tap_env_version = process.env[capitalized_tap_name];
    const docker_image = 'gbolahan/' + selected_tap + ':' + tap_env_version;
    // Install the tap image
    const docker = spawn('docker', ['run', docker_image]);

    // TODO: Send shell output
    docker.stdout.on('data', (data) => {
      console.log('The data', data.toString());
    });

    // TODO: Inform user of error
    docker.on('error', (data) => {
      console.log('The data', data.toString());
      reject();
    });

    // Complete, move on
    docker.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });

const writeFile = (fileName, content) => {
  return new Promise((resolve, reject) => {
    fs.mkdir('taps', (error) => {
      if (error) {
        console.log('Creation error', error);
      }
      fs.writeFile(`docker/tap/${fileName}`, content, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve('Success');
      });
    });
  });
};

module.exports = {
  detectDocker,
  installTap,
  writeFile
};
