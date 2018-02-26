## Running locally

### Clone the repository

```bash
git clone https://github.com/datadotworld/knot.git
cd knot
```

### Run the app

From the root directory:

```bash
yarn && yarn start
```

Press `CMD + R` after the compilation completes to refresh Electron

### Set up Docker

## Install tap(tap-redshift)

```bash
docker-compose run tap
```

## Run tap in discovery mode

```bash
docker-compose run tap tap-redshift -c docker/tap/config.json -d
```

NB: You can run tap with the properties and state flags by replacing discovery in the above command with `properties` and `state` respectively. Also, make sure `docker/tap` contains the `config.json` for tap and `properties.json` files.

## Install target(target-datadotworld)

```bash
docker-compose run target
```

NB: Make sure `docker/target` contains the `config.json` for target.

### Updating tap-redshift and target-datadotworld images

Make edits to the relevant Dockerfile by navigating into docker/images tap or target folder.

## Build updated images

For edited tap image, run;

```bash
docker build -t tap-redshift:{version} .
```

For edited target image, run,

```bash
docker build -t target-datadotworld:{version} .
```

## Login and push to docker hub

```bash
docker login
docker push gbolahan/tap-redshift:{version}
```
