FROM python:3.6-alpine
ARG version
RUN apk update && \
  apk add --virtual .build-deps gcc musl-dev linux-headers && \
  pip install tap-adwords==${version} && \
  apk --purge del .build-deps

WORKDIR /app
CMD ["tap-adwords"]