FROM python:latest
MAINTAINER 'data.world, Inc.(http://data.world/)'

# Create app directory
RUN pip install tap-redshift==1.0.0b4

COPY ./ /app/tap-redshift
WORKDIR /app

CMD ["tap-redshift"]