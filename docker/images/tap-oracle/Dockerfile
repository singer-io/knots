FROM ubuntu:18.04
ARG version
COPY instantclient-basic-linux.x64-12.2.0.1.0.zip ./
RUN apt update && \
    apt -y install unzip libaio1 python3-pip && \
    mkdir /opt/oracle && \
    cd /opt/oracle && \
    unzip /instantclient-basic-linux.x64-12.2.0.1.0.zip && \
    rm /instantclient-basic-linux.x64-12.2.0.1.0.zip && \
    cd /opt/oracle/instantclient_12_2 && \
    ln -s libclntsh.so.12.1 libclntsh.so && \
    ln -s libocci.so.12.1 libocci.so && \
    mkdir -p /opt/oracle/instantclient_12_2/network/admin && \
    pip3 install tap-oracle==${version}

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_12_2:$LD_LIBRARY_PATH
ENV PATH=/opt/oracle/instantclient_12_2:$PATH

WORKDIR /app
CMD ["tap-oracle"]
