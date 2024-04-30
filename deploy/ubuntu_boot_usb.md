# Ubuntu Boot USB
## Environment
- macOS Sonoma 14.4.1(23E224)
- Ubuntu 24.04 ISO
- A Blank USB Disk

## Format USB with Mac OS (Optional)
- Find USB Disk
```shell
diskutil list
```
```
/dev/disk17 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *62.0 GB    disk17
   1:       Microsoft Basic Data                         2.7 GB     disk17s1
   2:                        EFI ESP                     5.2 MB     disk17s2
   3:       Microsoft Basic Data                         307.2 KB   disk17s3
   4:           Linux Filesystem                         59.3 GB    disk17s4
```
- Unmount Disk
```shell
diskutil unmountDisk /dev/disk17
```
```
Unmount of all volumes on disk17 was successful
```
- Erase Disk
```shell
sudo diskutil zeroDisk /dev/disk17
```
```
Started erase on disk17
[ / 0%..10%.............................................. ] 10.9% 
```
- Format Disk
```shell
sudo diskutil eraseDisk FAT32 Ubuntu24U /dev/disk2
```

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
