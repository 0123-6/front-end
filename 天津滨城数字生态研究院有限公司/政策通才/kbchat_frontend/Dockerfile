From harbor.aiforgovernance.com/ai/node:lts-alpine3.16  as builder
ADD . /root/.
WORKDIR /root
# RUN npm install -g cnpm --registry=https://registry.npmmirror.com
# RUN npm update vue-loader
RUN npm install
RUN node scripts/build.js
USER root

FROM harbor.aiforgovernance.com/ai/centos-openresty:latest
COPY --from=builder /root/build /root/dist
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
