FROM python:3.6-alpine
ARG version
RUN pip install tap-facebook==${version}
WORKDIR /app
CMD ["tap-facebook"]
