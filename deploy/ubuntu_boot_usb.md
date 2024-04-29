# Ubuntu Boot USB
## Environment
- MacOS X
- Ubuntu 24.04 ISO

## Setup USB with Mac OS
- Find USB Disk
```shell
diskutil list
```
```
/dev/disk17 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *62.0 GB    disk17
   1:             Windows_FAT_32                         62.0 GB    disk17s1
```
- Unmount Disk
```shell
diskutil unmountDisk /dev/disk17
```
```
Unmount of all volumes on disk17 was successful
```
- Create DMG
```
hdiutil convert -format UDRW -o ubuntu-24.04-live-server-amd64.dmg ubuntu-24.04-live-server-amd64.iso
```
- Create Boot Disk with DMG
```
sudo dd if=ubuntu-24.04-live-server-amd64.dmg of=/dev/rdisk17 bs=1m
```
- Eject USB
```
diskutil eject /dev/disk17
```
