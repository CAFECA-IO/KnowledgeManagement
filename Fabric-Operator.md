# Fabric Operator Note

## Requirement
- Kubernetes is ready
- Istio is ready
- Helm is ready

## Sample
https://gitea-6f1861e5.baas.tmpstg.twcc.tw/TWCC-BAAS/fabric-operator/src/branch/tmp/operator/helm-charts

## Kubernetes command
- kubectl get pod
- kubectl get service
- kubectl logs {pod-name} {container-name} -n fabric
```shell
kubectl logs hlf-peer--atlantis--peer0-0 peer -n fabric
```
- kubectl exec --stdin --tty {pod-name} -- /bin/bash
```shell
kubectl exec --stdin --tty hlf-peer--atlantis--peer0-0 /bin/bash
```

## Helm command
- helm install
- helm uninstall
- helm list
- helm dependency update

## Simple Sample
```shell
git clone
```


## Pod restart with latest image
