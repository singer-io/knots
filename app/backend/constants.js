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

const commands = {
  runDiscovery:
    'docker run -v $(pwd)/docker/tap:/app/tap-redshift/data gbolahan/tap-redshift:1.0.0b3 tap-redshift -c tap-redshift/data/config.json -d > docker/tap/catalog.json',
  runSync:
    'docker run -v $(pwd)/docker/tap:/app/tap-redshift/data --interactive gbolahan/tap-redshift:1.0.0b3 tap-redshift -c tap-redshift/data/config.json --properties tap-redshift/data/catalog.json | docker run -v $(pwd)/docker/target:/app/target-datadotworld/data --interactive gbolahan/target-datadotworld:1.0.0b3 target-datadotworld -c target-datadotworld/data/config.json'
};

module.exports = {
  taps,
  commands
};
