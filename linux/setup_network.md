# Setup Network
1. Check the status of network interfaces to ensure they are available
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
2. The wired network interface is `enp12s0`
3. The wireless network interface is `wlp13s0`

## Setup Netplan
Edit the Netplan configuration file, using the default path for Ubuntu Server 22.04 as an example.
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
```shell
sudo netplan apply
```

## Final Check
```shell
ping -c 4 8.8.8.8
```
```
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=58 time=4.61 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=58 time=2.82 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=58 time=3.05 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=58 time=3.83 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 2.820/3.575/4.605/0.701 ms
```
