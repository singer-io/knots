FROM python:latest

# Create app directory
RUN pip install target-datadotworld

COPY ./ /app/docker/target
WORKDIR /app

RUN bash && target-datadotworld -c docker/target/target_config.json

CMD ["bash"]