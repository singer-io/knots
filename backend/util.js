const { spawn } = require('child_process');

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

const installTap = () =>
  new Promise((resolve, reject) => {
    // Run `docker -v` on the user's shell
    const docker = spawn('docker-compose', ['build', 'tap']);

    // A version number was returned, docker is installed
    docker.stdout.on('data', (data) => {
      console.log('The data', data.toString());
    });

    // Threw error, no Docker
    docker.on('error', (data) => {
      console.log('The data', data.toString());
      reject();
    });

    docker.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });

module.exports = {
  detectDocker,
  installTap
};
