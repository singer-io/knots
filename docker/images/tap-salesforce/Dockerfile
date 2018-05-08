FROM python:latest
LABEL maintainer='data.world, Inc.(http://data.world/)'
RUN pip install tap-salesforce==1.4.14
COPY ./ /app/tap-salesforce
WORKDIR /app
CMD ["tap-salesforce"]