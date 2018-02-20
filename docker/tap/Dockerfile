FROM python:latest

# Create app directory
RUN pip install tap-redshift

COPY ./ /app/docker/tap
WORKDIR /app

ARG discovery
ARG properties
ARG state
ARG arg
Run if [ "$arg" = "discovery" ]; then tap-redshift -c docker/tap/config.json -d; else echo Run docker-compose build --build-arg arg=discovery tap to run discovery on tap; fi

RUN if [ "$arg" = "properties" ]; then tap-redshift -c docker/tap/config.json $properties; else echo Run docker-compose build --build-arg arg=properties to run full sync; fi

RUN if [ "$arg" = "state" ]; then tap-redshift -c docker/tap/config.json $properties $state; else echo Run docker-compose build --build-arg arg=state to run sync from state file; fi

CMD ["bash"]