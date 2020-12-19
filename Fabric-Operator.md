# Fabric Operator Note

## Requirement
- Kubernetes is ready
- Istio is ready
- Helm is ready

## Sample
https://gitea-6f1861e5.baas.tmpstg.twcc.tw/TWCC-BAAS/fabric-operator/src/branch/tmp/operator/helm-charts

## Kubernetes command
- kubectl get namespaces
- kubectl create namespace {namespace}
```shell
kubectl create namespace wayne-playground
```
- kubectl get pod
- kubectl get service
- kubectl logs {pod-name} {container-name} -n {namespace}
```shell
kubectl logs hlf-peer--atlantis--peer0-0 peer -n fabric
```
- kubectl get pod -w -n {namespace}
```shell
kubectl get pod -w -n luphia-playground
```
- kubectl exec --stdin --tty {pod-name} -- /bin/sh
```shell
kubectl exec --stdin --tty hlf-peer--atlantis--peer0-0 /bin/bash
```

## Helm command
- helm install
```shell
cd fabric-operator/operator/helm-charts/createnetwork/
helm install createnetwork-76fe6563 . -n luphia-playground
```
- helm uninstall
- helm list
- helm dependency update

## External Chaincode
```shell

```

## Simple Sample
```shell
git clone
```


## Pod restart with latest image
