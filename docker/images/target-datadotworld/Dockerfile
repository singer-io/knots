FROM python:latest
MAINTAINER 'data.world, Inc.(http://data.world/)'
RUN pip install target-datadotworld==1.0.0b3
COPY ./ /app/target-datadotworld
WORKDIR /app
CMD ["target-datadotworld"]