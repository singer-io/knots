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

# Press `CMD + R` after the compilation completes to refresh Electron

### Set up Docker

## Install tap(tap-redshift)

```bash
docker-compose build tap
```

## Run tap in discovery mode

```bash
docker-compose build --build-arg arg=discovery tap
```

NB: You can run tap with the properties and state flags by replacing discovery in the above command with `properties` and `state` respectively. Also, make sure `docker/tap` contains the `config.json` for tap and `properties.json` files.

## Install target(target-datadotworld)

```bash
docker-compose build target
```

NB: Make sure `docker/target` contains the `config.json` for target.
