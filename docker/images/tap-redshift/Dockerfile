FROM python:latest
MAINTAINER 'data.world, Inc.(http://data.world/)'

# Create app directory
RUN pip install tap-redshift==1.0.0b3

COPY ./ /app/docker/tap
WORKDIR /app

CMD ["bash"]