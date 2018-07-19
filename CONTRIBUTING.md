# Contributing Guidelines

## General

- Contributions of all kinds (issues, ideas, proposals), not just code, are highly appreciated.
- Pull requests are welcome with the understanding that major changes will be carefully evaluated and discussed, and may not always be accepted. Starting with a discussion is always best!
- All contributions including documentation, filenames and discussions should be written in the English language.

## Issues

Our [issue tracker](https://github.com/datadotworld/knot/issues) can be used to report issues and propose changes to the current or next version of this connector.

## Contribute Code

### Relevant Docs

[List of singer taps and targets](https://github.com/singer-io)

### Fork the Project

Fork the project [on Github](https://github.com/datadotworld/knot.git) and check out your copy.

```sh
$ git clone https://github.com/[YOUR_GITHUB_NAME]/knot.git
$ cd knot
$ git remote add upstream https://github.com/datadotworld/knot.git
```

### Write Tests

Try to write a test that reproduces the problem you are trying to fix or describes a feature that you want to build.

We definitely appreciate pull requests that highlight or reproduce a problem, even without a fix.

### Write Documentation

Document any external behavior in the [README](README.md).

### Commit Changes

Make sure git knows your name and email address:

```sh
git config --global user.name "Your Name"
git config --global user.email "contributor@example.com"
```

Writing good commit logs is important. A commit log should describe what changed and why.

```sh
git add ...
git commit
```

### Push

```sh
git push origin my-feature-branch
```

### Make a Pull Request

Go to https://github.com/[YOUR_GITHUB_NAME]/knot.git and select your feature branch. Click the
'Pull Request' button and fill out the form. Pull requests are usually reviewed within a few days.

# Docker images for Taps and Targets

### Creating new docker images

Docker images can be built for both Taps and Targets. For example, to build a new Tap image for tap-redshift;

Create tap-redshift folder in `docker/images`

```sh
$ cd docker/images
$ mkdir tap-redshift
```

cd into `tap-redshift` directory and create a `Dockerfile`

```sh
$ touch Dockerfile
```

Within the Dockerfile, specify necessary commands to build your image.

Sample of a Dockerfile to build an image from `tap-redshift` python package and `python:latest` as the base image;

```
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

Add the newly built tap image in `./app/backend/constants.js` under the `taps` list. The `taps` section should look like;

```
const taps = [
  {
    name: 'Redshift',
    tapKey: 'tap-redshift',
    tapImage: 'gbolahan/tap-redshift:1.0.0b5',
    repo: 'https://github.com/datadotworld/tap-redshift',
    options: [],
    logo: 'https://link-to-image'
  },
```

#### Updating docker images

Make changes to the Dockerfile of the image to update then build and tag the image with a different version from the previous;

```sh
$ docker build -t dataworld/{IMAGE_NAME}:{NEW_VERSION} .
```

For example, once updates are made to the `tap-redshift` image, make a new build;

```sh
$ docker build -t dataworld/tap-redshift:2.0 .
```

Update the tap image in `./app/backend/constants.js` to the updated version of the image and test.

#### Releasing created and updated images

After building and testing the image, push to Docker Hub;

```sh
$ docker push dataworld/{IMAGE_NAME}:{VERSION}
```

## Thank you!

Thank you in advance for contributing to this project!
