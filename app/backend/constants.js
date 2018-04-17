const os = require('os');

const taps = [
  {
    name: 'Redshift',
    key: 'tap-redshift',
    version: '1.0',
    repo: 'https://github.com/datadotworld/tap-redshift',
    logo:
      'https://cdn.zapier.com/storage/services/1e66b95901e0564c9e990c320705b69a.128x128.png',
    active: true
  }
];

const targets = [
  {
    name: 'data.world',
    key: 'target-datadotworld',
    version: '1.0',
    logo:
      'http://www.musketeercapital.com/wp-content/uploads/2016/03/logo_dataWorld.png',
    active: true
  }
];

const tapRedshiftDockerCommand = `FROM python:latest${
  os.EOL
}MAINTAINER 'data.world, Inc.(http://data.world/)'${
  os.EOL
}RUN pip install tap-redshift==1.0.0b4${os.EOL}COPY ./ /app/tap-redshift${
  os.EOL
}WORKDIR /app${os.EOL}CMD ["tap-redshift"]`;

const targetDataWorldDockerCommand = `FROM python:latest${
  os.EOL
}MAINTAINER 'data.world, Inc.(http://data.world/)'${
  os.EOL
}RUN pip install target-datadotworld==1.0.0b3${
  os.EOL
}COPY ./ /app/target-datadotworld${os.EOL}WORKDIR /app${
  os.EOL
}CMD ["target-datadotworld"]`;

const commands = {
  runDiscovery: (folderPath) =>
    `docker run -v ${folderPath}/docker/tap:/app/tap-redshift/data gbolahan/tap-redshift:b4 tap-redshift -c tap-redshift/data/config.json -d > ${folderPath}/docker/tap/catalog.json`,
  runSync: (folderPath) =>
    `docker run -v ${folderPath}/tap:/app/tap-redshift/data --interactive gbolahan/tap-redshift:b4 tap-redshift -c tap-redshift/data/config.json --properties tap-redshift/data/catalog.json | docker run -v ${folderPath}/target:/app/target-datadotworld/data --interactive gbolahan/target-datadotworld:1.0.0b3 target-datadotworld -c target-datadotworld/data/config.json`
};

module.exports = {
  taps,
  tapRedshiftDockerCommand,
  targetDataWorldDockerCommand,
  commands,
  targets
};
