用VS code編輯docker-containers / aws(ssh)內的文件：

由於 Remote - Containers 內部使用 Docker 進行容器化的相關程序，因此電腦需要先安裝 Docker Desktop 。

VS Code安裝 Remote - Containers 延伸模組

安裝完成後，可以看到 VS Code 的左下角多了一個遠端總管。

### Container

在Docker Container運行中時，可以在遠端總管內點選要編輯的container
CONTAINERS > Dev Containers > ubuntu:14.04

完成後在VSCode最左下角處會顯示目前連接狀態，此時即可打開container內文件進行編輯。

要開新視窗時，在目標Container身上按右鍵Attach in New Window

*如有git控制，不建議使用此方法，請將需要git控制的資料夾bind回本機(容器資料分離邏輯)。

### SSH

新增SSH target會出現一個小視窗，輸入ssh連線用的pem & name@host即可
```
ssh -i ~/.ssh/<ssh pme file>.pem name@host_ip
```

ref: 
https://ithelp.ithome.com.tw/articles/10277952
https://code.visualstudio.com/docs/remote/containers
