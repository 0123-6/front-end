From harbor.aiforgovernance.com/ai/node:lts-alpine3.16  as builder
ADD . /root/.
WORKDIR /root
RUN npm install -g cnpm --registry=https://registry.npmmirror.com
RUN npm update vue-loader
RUN cnpm install
RUN cnpm run build:prod
USER root

FROM harbor.aiforgovernance.com/ai/centos-openresty:latest
COPY --from=builder /root/dist /root/dist
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

