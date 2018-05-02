# Knot

This app allows you to configure and download executable Singer pipelines.

### Adding Docker images

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

Sample of a Dockerfile to build an images from `tap-redshift` python package;

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
docker build -t tap-redshift:1.0 .
```
