FROM oraclelinux:7-slim

# if you hit ORA-12560 TNS:protocol adapter error
# or ORA-12154 TNS: could not resolve the connect identifier specified
# make sure that your function adds the fn group and user as shown below

RUN yum -y install oracle-release-el7 oracle-nodejs-release-el7 && \
    yum-config-manager --disable ol7_developer_EPEL && \
    yum -y install oracle-instantclient19.3-basiclite nodejs && \
    rm -rf /var/cache/yum && \
    groupadd --gid 1000 --system fn && \
    useradd --uid 1000 --system --gid fn fn

COPY wallet/* /usr/lib/oracle/19.3/client64/lib/network/admin/

WORKDIR /function
ADD package.json package-lock.json func.js func.yaml /function/
RUN npm install
ENTRYPOINT ["node", "func.js"]