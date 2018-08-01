# KNOTS

This app allows you to configure and download executable Singer pipelines.

### Getting Started

Download and install the dmg from [link](https://github.com/datadotworld/knots/releases)

### Prerequisites

Knots depends on Docker to be installed. You can install docker for mac [here](https://store.docker.com/editions/community/docker-ce-desktop-mac).

NOTE: Check Docker [file sharing preferences](https://docs.docker.com/docker-for-mac/osxfs/#namespaces) and make sure that `/User` is a shared directory.

### Running the app

1.  Select a tap to use from the list of available taps.
2.  Provide the configuration needed for the tap.
3.  Click on `Continue` to run the tap in discovery mode.
4.  Make selections of tables/streams to sync.
5.  Select a target and provide the target's config.
6.  Enter a name to save the new knot with, save and run the knot.

You should see a list of your saved knots and different actions (Re-run in both full and partial sync, Re-configure, download and delete) that can be taken on them.

### Contributing

Knots has been released as an open-source project. Community participation is encouraged and highly appreciated. If you'd like to contribute, please follow the [Contributing Guidelines](CONTRIBUTING.md).

### Support

For support, either create a [new issue](https://github.com/datadotworld/knots/issues/new) here on GitHub, or send an email to help@data.world.
