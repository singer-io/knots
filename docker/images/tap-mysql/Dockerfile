FROM python:3.6-alpine
RUN apk update && \
     apk add --virtual .build-deps gcc musl-dev linux-headers && \
     pip install tap-mysql==1.9.10 && \
     apk --purge del .build-deps

WORKDIR /app
CMD ["tap-mysql"]