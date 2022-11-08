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

## Install OpenSSH
```shell
sudo apt-get install openssh-server
```

## Setup Login Key
```shell
ssh-keygen -f myLoginKey.pem -y > myLoginKey.pub
cp myLoginKey.pub /root/.pub
ssh-copy-id ${username}@${hostname}
```

## Set SSH Entrance
```shell
chsh -s /bin/bash
usermod -s /bin/bash ${username}
```

## Example
```shell
useradd -m -s /usr/bin/bash luphia
```
```shell
passwd luphia <<!
asdf1234
!
```
```shell
sudo usermod -g sudo luphia
```
