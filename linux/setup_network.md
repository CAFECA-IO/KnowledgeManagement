# Setup Network
1. 檢查網路卡狀態是否可用
```shell
iwconfig
```
```
lo        no wireless extensions.

enp12s0   no wireless extensions.

wlp13s0   IEEE 802.11  ESSID:"CAFECA"  
          Mode:Managed  Frequency:5.765 GHz  Access Point: 10:71:B3:0A:AF:32   
          Bit Rate=780 Mb/s   Tx-Power=3 dBm   
          Retry short limit:7   RTS thr:off   Fragment thr:off
          Power Management:on
          Link Quality=70/70  Signal level=-40 dBm  
          Rx invalid nwid:0  Rx invalid crypt:0  Rx invalid frag:0
          Tx excessive retries:0  Invalid misc:1   Missed beacon:0

docker0   no wireless extensions.

cali645ca3069fd  no wireless extensions.

calib5363765ba5  no wireless extensions.

vxlan.calico  no wireless extensions.

```
2. 有線網路介面為 `enp12s0`
3. 無線網路介面 `wlp13s0`

## Setup Netplan
編輯 Netplan 設定檔，以 ubuntu server 22.04 預設路徑為例
```shell
sudo vi /etc/netplan/00-installer-config.yaml
```
```
# This is the network config written by 'subiquity'
network:
  version: 2
  ethernets:
    enp12s0:
      dhcp4: false
      dhcp6: false
      addresses:
        - 211.22.118.148/24
      routes:
        - to: default
          via: 211.22.118.254
      nameservers:
        addresses: [168.95.1.1, 168.95.192.1]
  wifis:
    wlp13s0:
      access-points:
        CAFECA:
          password: cafeca.io
      dhcp4: true
```

## Apply Config
```
sudo netplan apply
```

## Final Check
