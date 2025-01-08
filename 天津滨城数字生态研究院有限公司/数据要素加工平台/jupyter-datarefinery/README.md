
# 数据要素加工平台用到的jupyter

> jupyter当前目录下的文件不保证留存，只有data目录下的文件会被保存

## 编译镜像

```bash

git checkout dev && git pull || exit
docker build . -t harbor.aiforgovernance.com/ai/jupyter-datarefinery-dev:latest
docker push harbor.aiforgovernance.com/ai/jupyter-datarefinery-dev:latest

git checkout master && git pull || exit
docker build . -t harbor.aiforgovernance.com/ai/jupyter-datarefinery:latest
docker push harbor.aiforgovernance.com/ai/jupyter-datarefinery:latest

```

## 部署jupyter-datarefinery

```
# test环境
kubectl config use-context dev && helm upgrade --install jupyter-datarefinery  -f charts/values-dev.yaml ./charts --namespace default

# 生产环境
kubectl config use-context prod && helm upgrade --install jupyter-datarefinery  -f charts/values.yaml ./charts --namespace default
```
