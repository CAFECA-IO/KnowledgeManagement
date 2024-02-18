# Mount Disk
- Find Disk
- Create Partition
- Setup
- Mount to Folder
- Final Check

## Find Disk
- list all device
```shell
lsblk
```
```
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
loop0    7:0    0   87M  1 loop /snap/lxd/27037
loop1    7:1    0   87M  1 loop /snap/lxd/26975
loop2    7:2    0 63.9M  1 loop /snap/core20/2182
loop3    7:3    0 40.4M  1 loop /snap/snapd/20671
loop4    7:4    0 63.9M  1 loop /snap/core20/2105
vda    252:0    0   40G  0 disk 
└─vda1 252:1    0   40G  0 part /
vdb    252:16   0 1000G  0 disk 
```
- list all divice usage
```shell
lsblk -f
```
```
NAME   FSTYPE   FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
loop0  squashfs 4.0                                                    0   100% /snap/lxd/27037
loop1  squashfs 4.0                                                    0   100% /snap/lxd/26975
loop2  squashfs 4.0                                                    0   100% /snap/core20/2182
loop3  squashfs 4.0                                                    0   100% /snap/snapd/20671
loop4  squashfs 4.0                                                    0   100% /snap/core20/2105
vda                                                                             
└─vda1 ext4     1.0         92414257-97c5-46a0-9154-66c415ee7358   28.3G    23% /
vdb                                                      
```
- check if device not in used
```shell
sudo file -s /dev/vdb
```
```
/dev/vdb: data
```

## Create Partition
- format disk
```shell
sudo mkfs -t ext4 /dev/vdb
fdisk /dev/vdb
```
```
Command (m for help):      #type n to create new partition
Partition type:
p primary (0 primary, 0 extended, 4 free)
e extended
Select (default p):      #type p, or press Enter, to create primary partition (max 4)
Using default response p
Partition number (1-4, default 1):      #press Enter
Using default value 1
First sector (2048-67108863, default 2048):      #press Enter
Using default value 2048
Last sector, +sectors or +size{K,M,G} (2048-67108863, default 67108863):     #press Enter or use customized size
Using default value 67108863

Command (m for help): t     #type t, to change partition type
Selected partition 1     #it will be automatically selected if there is only 1 partition, otherwise you need to type it manually
Hex code (type L to list codes): 83      #type 83 (Linux partition)
Changed system type of partition 1 to 83 (Linux)

Command (m for help): w     #type w, to save. Warning: type q to quit if there is something wrong.
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
```
- create partition
```shell
mkfs.ext4 /dev/vdb1
```

## Setup
```shell
sudo echo "/dev/vdb1 /data ext4 defaults 0 1" >> /etc/fstab
```

## Mount to Folder
```shell
mount -a
```

## Final Check
```shell
df -h
```
