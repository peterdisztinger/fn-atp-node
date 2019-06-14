FROM node:10.15.3-stretch-slim as build-stage
WORKDIR /function
ADD package.json /function/
RUN npm install

WORKDIR /
COPY instantclient-basic-linux.x64-18.3.0.0.0dbru.zip ./

RUN apt-get update && \
    apt-get install unzip -y && \
    unzip instantclient-basic-linux.x64-18.3.0.0.0dbru.zip && \
    rm instantclient-basic-linux.x64-18.3.0.0.0dbru.zip

FROM node:10.15.3-stretch-slim
RUN mkdir -p opt/oracle && mkdir -p opt/oracle/instantclient_18_3
WORKDIR /opt/oracle
COPY --from=build-stage /instantclient_18_3 ./instantclient_18_3

RUN apt-get update && \
    apt-get install libaio1 build-essential -y

RUN sh -c "echo /opt/oracle/instantclient_18_3 > /etc/ld.so.conf.d/oracle-instantclient.conf" && \
    ldconfig
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_18_3:$LD_LIBRARY_PATH

COPY wallet/* ./instantclient_18_3/network/admin/

WORKDIR ./instantclient_18_3
RUN ln -fvs libocci.so.18.1 libocci.so && ln -fvs libclntsh.so.18.1 libclntsh.so

WORKDIR /function
ADD . /function/
COPY --from=build-stage /function/node_modules/ /function/node_modules/
ENTRYPOINT ["node", "func.js"]