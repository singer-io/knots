### Docker images for Taps and Targets

#### Creating new docker images

Docker images can be built for both Taps and Targets. For example, to build a new Tap image for tap-redshift;

Create tap-redshift folder in `docker/images`

```sh
$ cd docker/images
$ mkdir tap-redshift
```

cd into `tap-redhift` directory and create a `Dockerfile`

```sh
$ touch Dockerfile
```

Within the Dockerfile, specify necessary commands to build your image.

Sample of a Dockerfile to build an image from `tap-redshift` python package and `python:latest` as the base image;

```python
FROM python:latest
MAINTAINER 'data.world, Inc.(http://data.world/)'
RUN pip install tap-redshift==1.0.0b4
COPY ./ /app/tap-redshift
WORKDIR /app
CMD ["tap-redshift"]
```

Build the image;

```sh
$ docker build -t dataworld/tap-redshift:1.0 .
```

Create a `.env` file in the root folder and add the newly created docker image.

Sample of the `.env` file should look like;

```sh
TAP_REDSHIFT="dataworld/tap-redshift:1.0"
```

#### Updating docker images

Make changes to the Dockerfile of the image to update then build and tag the image with a different version from the previous;

```sh
$ docker build -t dataworld/{IMAGE_NAME}:{NEW_VERSION} .
```

For example, once updates are made to the `tap-redshift` image, make a new build, update `.env` file with the new version and test;

```sh
$ docker build -t dataworld/tap-redshift:2.0 .
```

#### Releasing created and updated images

After building and testing the image, push to Docker Hub;

```sh
$ docker push dataworld/{IMAGE_NAME}:{VERSION}
```
