FROM python:latest
MAINTAINER 'data.world, Inc.(http://data.world/)'
RUN pip install target-stitch==1.7.3
COPY ./ /app/target-stitch
WORKDIR /app
CMD ["target-stitch"]