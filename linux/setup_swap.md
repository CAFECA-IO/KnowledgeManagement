# Setup SWAP
Check the System for Swap and Memory Information
```shell
sudo swapon -s
free -m
```
Check Available Space on the Hard Drive Partition
```shell
df -h
```
```file
/dev/vda1        20G  8.9G  9.8G  48% /
none            4.0K     0  4.0K   0% /sys/fs/cgroup
udev            235M  4.0K  235M   1% /dev
tmpfs            50M  336K   49M   1% /run
none            5.0M     0  5.0M   0% /run/lock
none            246M     0  246M   0% /run/shm
none            100M     0  100M   0% /run/user
```
Create a Swap File
```shell
sudo fallocate -l 4G /swapfile
```
Enabling the Swap File
```shell
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab
```
