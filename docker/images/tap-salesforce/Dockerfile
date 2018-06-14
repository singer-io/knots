FROM python:3.6-alpine
ARG version
RUN pip install tap-salesforce==${version}
WORKDIR /app
CMD ["tap-salesforce"]
