# KNOTS

KNOTS is a quick and intuitive visual ETL tool that allows you to do complex data replication with ease. Using the
visual interface, you can now bring your data together with the power of Singer taps and targets, without
the complexity.

Using KNOTS, you can import data from a number of datastores on an ad-hoc basis or you can download knots and run
with a job scheduler of your choice to make sure your data is always up to date. With the intuitive interface,
you can configure robust data replication processes in minutes, and KNOTS is always free.

_KNOTS is currently only available on MacOS._

### Getting Started

Download and install the latest [release](https://github.com/singer-io/knots/releases). For Mac, you'll
want to use the DMG installer.

### Prerequisites

KNOTS depends on Docker being installed and running. Docker is a tool designed to make it easier to create, deploy,
and run containers. Containers allow us to package up an application or library with all of its dependencies. Each
of the individual taps and targets are packaged into containers as they may have widely-different sets of dependencies.

The installer for Docker for Mac is available [here](https://store.docker.com/editions/community/docker-ce-desktop-mac).

NOTE: Check Docker [file sharing preferences](https://docs.docker.com/docker-for-mac/osxfs/#namespaces) and
make sure that `/Users` is a shared directory.

### Running the app

1.  From the home screen, click on `Get Started`, or `New knot` on the upper right-hand corner.
2.  Select a tap to use from the list of available taps.
3.  Provide the configuration values required by the tap.
4.  Click on `Continue` to run the tap in Discovery mode.
5.  Select the tables/streams that you would like to sync.
6.  Like with the tap, select a target from the list and provide its configuration information.
7.  Enter a name for the new knot, and click on `Save & Run` to execute it.

Once the process has finished, click on `Done` to return to the home screen. You should now see a list of your
saved knots and the various actions (`Sync new data`, `Sync all data`, `Edit`, `Export`, and `Delete`) that can
be taken on them.

### Run with a scheduler

As of today, KNOTS allows you to update the data by manually clicking on the `Sync new data` action. By making use
of the `Export` action though, and the resources that it provides, it's possible to setup a job that will update
the data automatically on a schedule.

The exported package is a ZIP file that includes the tap and target for your knot, as well as their configurations,
and a Makefile. You can read more about Makefiles
[here](http://www.sis.pitt.edu/mbsclass/tutorial/advanced/makefile/whatis.htm), but the gist of it is that
we've specified different shell commands in there that can be executed to sync the data.

As an example, if you're on a Mac or Linux computer, you can `cd` into the directory with the Makefile,
and run `make sync` to update the data from the point of last run. You can take it a step further by
automating the process using [crontab](http://benr75.com/pages/using_crontab_mac_os_x_unix_linux).
This requires that your PC be on, and a better approach would be to use a server that you maintain or
some sort of cloud service.

### Contributing

KNOTS has been released as an open-source project. Community participation is encouraged and highly appreciated.
If you'd like to contribute, please follow the [Contributing Guidelines](CONTRIBUTING.md).

### Support

If you run into any problems, please create a [new issue](https://github.com/singer-io/knots/issues/new).
