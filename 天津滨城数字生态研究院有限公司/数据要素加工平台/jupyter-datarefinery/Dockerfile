# FROM harbor.aiforgovernance.com/ai/centos-develop:latest
FROM harbor.aiforgovernance.com/ai/jupyter-datarefinery-base:latest

ENV ROOT_DIR=/root/notebook

RUN mkdir -p ${ROOT_DIR} ${ROOT_DIR}/data
WORKDIR ${ROOT_DIR}

# COPY notebook /usr/local/lib/python3.8/dist-packages/notebook
ADD notebook /usr/local/lib/python3.8/dist-packages/notebook

ENV NB_PREFIX /
ENV GRANT_SUDO=yes

EXPOSE 8888

USER root

CMD ["sh","-c", "jupyter notebook  \
    --notebook-dir=/root/notebook \
    --ip=0.0.0.0 \
    --no-browser \
    --allow-root \
    --port=8888 \
    --NotebookApp.token='' \
    --NotebookApp.password='' \
    --NotebookApp.allow_origin='*' \
    --NotebookApp.base_url=${NB_PREFIX} \
    --NotebookApp.tornado_settings='{\"headers\" :{\"Content-Security-Policy\" :\"frame-ancestors self *.datarefinery.cn *.datarefinery.cn:* localhost:*\"}}' \
    "]





