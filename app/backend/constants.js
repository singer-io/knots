const os = require('os');

const taps = [
  {
    name: 'Redshift',
    tapKey: 'tap-redshift',
    version: '1.0',
    repo: 'https://github.com/datadotworld/tap-redshift',
    logo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAn1BMVEX///9SlM8gW5kuc7hQks0paqw9gMEgXJoAUZRHj8260uqrvdQAZbL6/P4LVJYcWZhDjcwASpEATpNZmNGuyuadsczb5/TI2u4rYp1jntPAzd7x9vvO2OW4xtk7a6LF2e0LYqp1qNcqeb6itc+1z+g9baOGsdxVfKs4iMrn7/jf5u9ujbaYvOCCnL+Qt955lbvJ0+Jfg699rNoARI6OpcXaVDOdAAADm0lEQVR4nO3d2XLaMBhA4ZiqtR1qvAAJAUz2Qtambd7/2SqBIQbsYAuvmXNuk5H0RZMLxMV/ckJEREREREREdChnePXzUDcDp+5jaucMXev7t0P9sMWg7pNqNuxZnU4GoSFsu43GW1f6sgkNaWzdPUa+rEJp9Iy7ug+do+7al13YKmPX3PjyCJfG07oPn6GwY7kdPWErjOEoiPvyCpWxf1k34pNCc8eXX9hoYzjb8+kIlfGiicZxkk9PuDSe1w3aKcWnK2yccXyf4tMXNsvo+Gm+Y4TSuGjKpw6nV47QsBFWFUKECOsPIUKE9fdFhI9nqT+qQzh9KNg3/eN73vXgLHHLioWT6XDuB4u/6X/y/L3NA9dU77aenaSsUOi8vc97gdzPFcK7Lsq4ep0wV5tK5eLi+XxSg3Ayfr/3pW65mSsKe+3oRq9n5sfG6i7jygqEUjezgtg+Srh8tTry9VF9exStam5vHr/LkoUP4cvMD3b2WAmVURzx7dzk3fp4vTb3DyCVXv/1clKaUEjd71FgJay/FqpT2M+Tw5ikxn585QThRpkOPE5ozPwk3bZQ3fVC70Wna8WXTBEulaUJ0xfeEhq23n9jA4QmQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiLDVwn/xk6cKhbBLE6YPA9sSioXm9LXpPDZSPFEobNszft2VJuw+mb6VuHpMeNSYwOl8MxZ+T7jSnT6UOVlOHuGx+9QJLHd3h43w6DGIm3vcEqrJef3X02hSZunTAaVytDOBLRKKRQFjHqN73AjXE/M+fqOSCY87U/SWwsLGWKp7dM1kXWXCtTK6Syks5P4+jIFrSN3ufM6KharJ+GUWBD3XLm4M6drYT9RVLoyUo4J9n/dFJh5/EkKECOsPIUKE9YcQYQuEfjlCsWiK8GR8H6QZ9YXCu9CbmF5O41mKUVfYMJ8qxagnbKBPFSYZdYTSd1k3JqXQ3DPmFwqv31SfKhztGPMKG+5ThZ2tR+p8QuEZmu/zldY1LT1hS3yqrmvlF0rfXd0Hz9Ht2phV2DKfKjJmEwpbDOo+sEbDnpVNKGy7jT6ZM3StDMJ23l+UM7z6eaibQWM+QRARERERERFRg/sPWgsdm/HykUYAAAAASUVORK5CYII='
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
    `docker run -v ${folderPath}/tap:/app/tap-redshift/data --interactive gbolahan/tap-redshift:b4 tap-redshift -c tap-redshift/data/config.json --properties tap-redshift/data/catalog.json | docker run -v ${folderPath}/target:/app/target-datadotworld/data --interactive gbolahan/target-datadotworld:1.0.0b3 target-datadotworld -c target-datadotworld/data/config.json > ${folderPath}/tap/state.json`,
  runPartialSync: (folderPath) =>
    `docker run -v ${folderPath}/tap:/app/tap-redshift/data --interactive gbolahan/tap-redshift:b4 tap-redshift -c tap-redshift/data/config.json --properties tap-redshift/data/catalog.json --state tap-redshift/data/state.json | docker run -v ${folderPath}/target:/app/target-datadotworld/data --interactive gbolahan/target-datadotworld:1.0.0b3 target-datadotworld -c target-datadotworld/data/config.json > ${folderPath}/tap/state.json`
};

module.exports = {
  taps,
  tapRedshiftDockerCommand,
  targetDataWorldDockerCommand,
  commands,
  targets
};
