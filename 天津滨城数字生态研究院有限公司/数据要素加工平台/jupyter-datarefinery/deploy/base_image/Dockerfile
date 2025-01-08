FROM harbor.aiforgovernance.com/ai/ubuntu-python:latest

ENV ROOT_DIR=/root/notebook \
    PIP_CACHE_DIR=/.cache


RUN set -eux \
    && apt-get update && apt-get  -y upgrade \
    && apt-get install -y  \
#      gcc build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev  \
#      libgdbm-compat-dev libreadline-dev libffi-dev libsqlite3-dev libbz2-dev tk-dev uuid-dev \
#      mysql-client libmysqlclient-dev \
      vim git wget


RUN mkdir -p ${ROOT_DIR} ${ROOT_DIR}/data
WORKDIR ${ROOT_DIR}


# Copying src code to Container
RUN ln -s ${ROOT_DIR} /notebooks

COPY requirements.txt ./

# RUN pip3 install --no-cache-dir --upgrade pip -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com
# RUN pip3 install --no-cache-dir -r requirements.txt -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com

RUN pip3 install --upgrade pip -i https://mirrors.cloud.aliyuncs.com/pypi/simple/ --trusted-host mirrors.cloud.aliyuncs.com
RUN pip3 install -r requirements.txt -i https://mirrors.cloud.aliyuncs.com/pypi/simple/ --trusted-host mirrors.cloud.aliyuncs.com



# docker build . -t harbor.aiforgovernance.com/ai/jupyter-datarefinery-base:latest
# docker push harbor.aiforgovernance.com/ai/jupyter-datarefinery-base:latest


