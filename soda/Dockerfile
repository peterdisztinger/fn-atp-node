FROM oraclelinux:7-slim

RUN groupadd --gid 1000 --system fn && useradd --uid 1000 --system --gid 1000 fn

RUN yum -y install oracle-release-el7 oracle-nodejs-release-el7 && \
    yum-config-manager --disable ol7_developer_EPEL && \
    yum -y install oracle-instantclient19.3-basiclite nodejs && \
    rm -rf /var/cache/yum

COPY wallet/* /usr/lib/oracle/19.3/client64/lib/network/admin/
RUN chmod 777 -R /usr/lib/oracle/19.3/client64/lib/network/admin/
RUN chown fn:fn /usr/lib/oracle/19.3/client64/lib/network/admin/*

WORKDIR /function
ADD package.json package-lock.json func.js func.yaml /function/
RUN npm install
ENTRYPOINT ["node", "func.js"]