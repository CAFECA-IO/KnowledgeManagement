# Create sudoer user in Ubuntu
```shell
useradd -m -s /usr/bin/bash ${username}
```
```shell
passwd ${username}
New password:
```
```shell
sudo usermod -g sudo ${username}
```
