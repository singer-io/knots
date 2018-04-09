FROM python:latest
MAINTAINER 'data.world, Inc.(http://data.world/)'
RUN pip install tap-redshift==1.0.0b3
COPY ./ /app/tap-redshift
WORKDIR /app
CMD ["tap-redshift"]