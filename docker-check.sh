#!/bin/sh
if [[ $(which docker) && $(docker -v) ]]; then
    echo 'Docker Found'
else
    echo 'Install docker'
fi

if [[ $(docker -v) == *' 17.'* ]]; then
    echo "Version matched"
else
    echo 'Install a version higher than 17.0'
fi

if [[ $(docker-compose 2> /dev/null) ]]; then
    echo 'Requires docker-compose but it is not installed.'
else
    echo 'docker-compose installed'
fi
