# DCRM
研究 DCRM 作為跨鏈技術溝通與底層交易簽章工具可行性

## 概述

## 研究目的
- DCRM 資安調查
  - 資訊安全事件
  - 技術漏洞
- 技術可用性
  - 部署方法
- 驗證門限簽名交易機制
  - Ethereum
  - Bitcoin
- 整合 AnySwap Cross Chain Bridge

## 研究結論

有幾點不確定。

- 測試用的client輔助，sign的部分沒看出來是如何帶to address、data等資訊，只有下key跟group。

- 簽名需要全部人都有表達意見（同意或反對）才會更改狀態，而非過半。

## 驗證資料

### 測試2/3共管帳戶

1. 環境準備

  1. VPS server with 1 CPU and 2G mem
  2. Static public IP
  3. Golang ^1.12

2. clone與編譯

```sh
git clone https://github.com/fsn-dev/dcrm-walletService.git
cd dcrm-walletService
make
```

產出會在`bin/cmd`

3. 執行bootnode

```sh
cd bin/cmd
./bootnode -genkey bootnode.key
./bootnode -nodekey bootnode.key

# 會顯示enode
# UDP listener up, self enode://cf0b9965908c154d83a70513f66db75d13efe0a6996a1d468e0e5aa1c9348ceb2ec0fc9f79f502651fd147d553dcd3031eb78fdf54c71a90cfce44d3ed5d18f3@127.0.0.1:11920

# 127.0.0.1 可替換成對外ip
```

4. 建立並執行3個節點

```sh
./gdcrm --genkey node1.key
./gdcrm --genkey node2.key
./gdcrm --genkey node3.key

./gdcrm --nodekey node1.key --rpcport 4449 --port 8011 --datadir ./node1 --bootnodes enode://cf0b9965908c154d83a70513f66db75d13efe0a6996a1d468e0e5aa1c9348ceb2ec0fc9f79f502651fd147d553dcd3031eb78fdf54c71a90cfce44d3ed5d18f3@127.0.0.1:11920

./gdcrm --nodekey node2.key --rpcport 4450 --port 8012 --datadir ./node2 --bootnodes enode://cf0b9965908c154d83a70513f66db75d13efe0a6996a1d468e0e5aa1c9348ceb2ec0fc9f79f502651fd147d553dcd3031eb78fdf54c71a90cfce44d3ed5d18f3@127.0.0.1:11920

./gdcrm --nodekey node3.key --rpcport 4451 --port 8013 --datadir ./node3 --bootnodes enode://cf0b9965908c154d83a70513f66db75d13efe0a6996a1d468e0e5aa1c9348ceb2ec0fc9f79f502651fd147d553dcd3031eb78fdf54c71a90cfce44d3ed5d18f3@127.0.0.1:11920

```

5. 建立2/3群組

```sh
 ./gdcrm-client -cmd SetGroup -url http://127.0.0.1:4449 -ts 2/3 -node http://127.0.0.1:4449 -node http://127.0.0.1:4450 -node http://127.0.0.1:4451

 # return Gid = ce4a50a5ffd8e9d3613aa1c5331c6fb8dd22ee89e9fde4538c7aa937cec5b1c6668c6baee58c7da22d2210370eceac88df445a6d0d90935b0da96da5e4f3f4e4
```

6. 取得各enode簽名

- node1

```sh
./gdcrm-client -cmd EnodeSig -url http://127.0.0.1:4449

# return enodeSig self =
# enode://382ce5b84d287ec9afbd703c43e4ee4e8f6770a77571868d0884674ac2d871c4ae8bb1adb17894a6aed4ab69ee41f2c26eebb66351ffd97bf8f1bd4c45e04f25@127.0.0.1:80110x9ab7d3b7e53791b3e0d15d081967d2165c0338ba34b37b2a2b988065ee2a9a8231c2f9ede055cd22f66b29a2f31bdb4b2b5b308059fd961d89c2b995753a4ec800
```

- node2

```sh
./gdcrm-client -cmd EnodeSig -url http://127.0.0.1:4450

# return enodeSig self =
# enode://408f18b2e9ee70708283140d4eb0e91d88327c2950865c48b80320bd76f5b6b18bac53743db67fe50cd2ec07cf0d301b36b96b7c768a897de02471e7c8312294@127.0.0.1:80120xd6cd7b300e4a9ff715ec603e086742fe42dacaef9f1ea36210d9ad0d7b4ba03255c0d88c61f769fa1a4c0dacb602748a2061922333aad1291cb2da69e2a2089700
```

- node3

```sh
./gdcrm-client -cmd EnodeSig -url http://127.0.0.1:4451

# return enodeSig self =
# enode://32cb2950bbdef82de50493753d03ad339fa1a96636fdb12f5b937f3a949d4b10c65d683ce8c88725e0d4ba98ab5827f43a65162064b4ce1e98b1554d7e5d2b07@127.0.0.1:80130xdd8b0707b1da3b03e40bebeebd26df5d4b6466d45f591f465732e4e61d566db03d8b092b1a23c4ba573bf1763c0f8b3c9db85204e273d41ce2ee308becab891e00
```

7. 由node1發起共管帳號

sigN 是上面取得第N個node的enodeSig

```sh
./gdcrm-client -cmd REQDCRMADDR -ts 2/3 -gid ce4a50a5ffd8e9d3613aa1c5331c6fb8dd22ee89e9fde4538c7aa937cec5b1c6668c6baee58c7da22d2210370eceac88df445a6d0d90935b0da96da5e4f3f4e4 -mode 0 -url http://127.0.0.1:4449 -sig enode://382ce5b84d287ec9afbd703c43e4ee4e8f6770a77571868d0884674ac2d871c4ae8bb1adb17894a6aed4ab69ee41f2c26eebb66351ffd97bf8f1bd4c45e04f25@127.0.0.1:80110x9ab7d3b7e53791b3e0d15d081967d2165c0338ba34b37b2a2b988065ee2a9a8231c2f9ede055cd22f66b29a2f31bdb4b2b5b308059fd961d89c2b995753a4ec800 -sig enode://408f18b2e9ee70708283140d4eb0e91d88327c2950865c48b80320bd76f5b6b18bac53743db67fe50cd2ec07cf0d301b36b96b7c768a897de02471e7c8312294@127.0.0.1:80120xd6cd7b300e4a9ff715ec603e086742fe42dacaef9f1ea36210d9ad0d7b4ba03255c0d88c61f769fa1a4c0dacb602748a2061922333aad1291cb2da69e2a2089700 -sig enode://32cb2950bbdef82de50493753d03ad339fa1a96636fdb12f5b937f3a949d4b10c65d683ce8c88725e0d4ba98ab5827f43a65162064b4ce1e98b1554d7e5d2b07@127.0.0.1:80130xdd8b0707b1da3b03e40bebeebd26df5d4b6466d45f591f465732e4e61d566db03d8b092b1a23c4ba573bf1763c0f8b3c9db85204e273d41ce2ee308becab891e00

# return 
# address = 0x00c37841378920E2BA5151a5d1E074Cf367586c4
# accounts = {"Data":{"result":{"Group":[]}},"Error":"","Status":"Success","Tip":""}


# reqDCRMAddr:User=0x00c37841378920E2BA5151a5d1E074Cf367586c4
# dcrm_getReqAddrStatus=Pending
# keyID=0x798d17bfc57203603fd7624ec1d3efffbf0553c779ff09ede002f627a6205f7d
```

8. 同意創建共管帳戶

其他兩個節點node2, node3用上面取得的keyID作為-key的參數，同意創建共管帳戶

```sh
./gdcrm-client -cmd ACCEPTREQADDR -url http://127.0.0.1:4450 -key 0x798d17bfc57203603fd7624ec1d3efffbf0553c779ff09ede002f627a6205f7d

./gdcrm-client -cmd ACCEPTREQADDR -url http://127.0.0.1:4451 -key 0x798d17bfc57203603fd7624ec1d3efffbf0553c779ff09ede002f627a6205f7d

# returns
# To address: =  0x00000000000000000000000000000000000000dc
# Recover from address = 0x00c37841378920E2BA5151a5d1E074Cf367586c4
# dcrm_getCurNodeReqAddrInfo = [{"Account":"0x00c37841378920E2BA5151a5d1E074Cf367586c4","Cointype":"ALL","GroupId":"ce4a50a5ffd8e9d3613aa1c5331c6fb8dd22ee89e9fde4538c7aa937cec5b1c6668c6baee58c7da22d2210370eceac88df445a6d0d90935b0da96da5e4f3f4e4","Key":"0xbad7db965557a8121ef5708a1c5f616a576793e09f6a55777a1a6df6ca12b61c","Mode":"0","Nonce":"1","ThresHold":"2/3","TimeStamp":"1631866827811"}]

# SignTx:
# ChainId		=30400
# Gas		=100000
# GasPrice	=80000
# Nonce		=0
# ToAddr		=0x00000000000000000000000000000000000000dc
# Hash		=0x14757bc75cea790c089c3a1af541d14d6e638e46ba2366da2c61455ac89f39a1
# Data		={"TxType":"ACCEPTREQADDR","Key":"0xbad7db965557a8121ef5708a1c5f616a576793e09f6a55777a1a6df6ca12b61c","Accept":"AGREE","TimeStamp":"1631866890030"}
# RawTransaction = 0xf8f88083013880830186a09400000000000000000000000000000000000000dc80b8927b22547854797065223a2241434345505452455141444452222c224b6579223a22307862616437646239363535353761383132316566353730386131633566363136613537363739336530396636613535373737613161366466366361313262363163222c22416363657074223a224147524545222c2254696d655374616d70223a2231363331383636383930303330227d82eda4a0353001ba6ba1516a05da040b78abd60ccc41ee31cd75a16124ee5b05c1323cd9a01100f48b7eb253509cebaeda6b466200adaa1421b9296a0fbbd9145246288423

# dcrm_acceptReq result: key[2]	0xbad7db965557a8121ef5708a1c5f616a576793e09f6a55777a1a6df6ca12b61c = Success

```

>注意，提案會過期，會停在dcrm_getCurNodeReqAddrInfo = null

9. 查詢創建結果，取得pubkey

```sh
curl -X POST -H "Content-Type":application/json --data '{"jsonrpc":"2.0","method":"dcrm_getAccounts","params":["0x00c37841378920E2BA5151a5d1E074Cf367586c4","0"],"id":67}' http://127.0.0.1:4449

# return
# {
#     "jsonrpc": "2.0",
#     "id": 67,
#     "result": {
#         "Data": {
#             "result": {
#                 "Group": [
#                     {
#                         "GroupID": "ce4a50a5ffd8e9d3613aa1c5331c6fb8dd22ee89e9fde4538c7aa937cec5b1c6668c6baee58c7da22d2210370eceac88df445a6d0d90935b0da96da5e4f3f4e4",
#                         "Accounts": [
#                             {
#                                 "PubKey": "0430a9302e7938c3c57d6283299c53c34afa741b087c01f09a39a8c6a1cd145e70b83785a6c78c0d257277d8f1bc3d34e1a6b088c5d1e0e69eb3670b1e88724e0a",
#                                 "ThresHold": "2/3",
#                                 "TimeStamp": "1631866890473"
#                             }
#                         ]
#                     }
#                 ]
#             }
#         },
#         "Error": "",
#         "Status": "Success",
#         "Tip": ""
#     }
# }
```

10. 測試共管sign接口

```sh
./gdcrm-client -cmd SIGN -ts 2/3 -gid ce4a50a5ffd8e9d3613aa1c5331c6fb8dd22ee89e9fde4538c7aa937cec5b1c6668c6baee58c7da22d2210370eceac88df445a6d0d90935b0da96da5e4f3f4e4 -mode 0 -url http://127.0.0.1:4449 -pubkey 0430a9302e7938c3c57d6283299c53c34afa741b087c01f09a39a8c6a1cd145e70b83785a6c78c0d257277d8f1bc3d34e1a6b088c5d1e0e69eb3670b1e88724e0a

# return
# To address: =  0x00000000000000000000000000000000000000dc
# Recover from address = 0x00c37841378920E2BA5151a5d1E074Cf367586c4
# dcrm_getSignNonce = {"Data":{"result":"0"},"Error":"","Status":"Success","Tip":""}
# Nonce = 0

# SignTx:
# ChainId		=30400
# Gas		=100000
# GasPrice	=80000
# Nonce		=0
# ToAddr		=0x00000000000000000000000000000000000000dc
# Hash		=0x5ced80ea0e89199233f48bf3c97f92eb6e95ab42061b7c03f7fec6d6765b4300
# Data		={"TxType":"SIGN","PubKey":"0430a9302e7938c3c57d6283299c53c34afa741b087c01f09a39a8c6a1cd145e70b83785a6c78c0d257277d8f1bc3d34e1a6b088c5d1e0e69eb3670b1e88724e0a","MsgContext":["smpcwallet.com"],"MsgHash":["0xb55aab117b3c74cc8957d3a7d394379bfae5e81aa752e3151c7d5b541b166076"],"Keytype":"ECDSA","GroupId":"ce4a50a5ffd8e9d3613aa1c5331c6fb8dd22ee89e9fde4538c7aa937cec5b1c6668c6baee58c7da22d2210370eceac88df445a6d0d90935b0da96da5e4f3f4e4","ThresHold":"2/3","Mode":"0","TimeStamp":"1632815823952"}
# RawTransaction = 0xf9024f8083013880830186a09400000000000000000000000000000000000000dc80b901e87b22547854797065223a225349474e222c225075624b6579223a2230343330613933303265373933386333633537643632383332393963353363333461666137343162303837633031663039613339613863366131636431343565373062383337383561366337386330643235373237376438663162633364333465316136623038386335643165306536396562333637306231653838373234653061222c224d7367436f6e74657874223a5b22736d706377616c6c65742e636f6d225d2c224d736748617368223a5b22307862353561616231313762336337346363383935376433613764333934333739626661653565383161613735326533313531633764356235343162313636303736225d2c224b657974797065223a224543445341222c2247726f75704964223a226365346135306135666664386539643336313361613163353333316336666238646432326565383965396664653435333863376161393337636563356231633636363863366261656535386337646132326432323130333730656365616338386466343435613664306439303933356230646139366461356534663366346534222c225468726573486f6c64223a22322f33222c224d6f6465223a2230222c2254696d655374616d70223a2231363332383135383233393532227d82eda3a01d38c6c6f35ff3184acf4f292e2f348d478ed1d213b8c9d012bafbf49d297447a04ae3db13cafdd1f88dff00dafda5601602a1132b427a66fd179786722fe54a82

# dcrm_sign keyID = 0x959f90765abcb08bbd596b268c731aeb2869f9ddc0de3cb4c700dedd265b864d


# Waiting for stats result (loop 1)...


# User=0x00c37841378920E2BA5151a5d1E074Cf367586c4	dcrm_getSignStatus=Pending	keyID=0x959f90765abcb08bbd596b268c731aeb2869f9ddc0de3cb4c700dedd265b864d
```

11. 其他節點同意簽名請求

複製上面取得的keyID = 0x959f90765abcb08bbd596b268c731aeb2869f9ddc0de3cb4c700dedd265b864d

```sh
./gdcrm-client -cmd ACCEPTSIGN  -url http://127.0.0.1:4450 -key 0x959f90765abcb08bbd596b268c731aeb2869f9ddc0de3cb4c700dedd265b864d

./gdcrm-client -cmd ACCEPTSIGN  -url http://127.0.0.1:4451 -key 0x959f90765abcb08bbd596b268c731aeb2869f9ddc0de3cb4c700dedd265b864d


# return
# To address: =  0x00000000000000000000000000000000000000dc
# Recover from address = 0x00c37841378920E2BA5151a5d1E074Cf367586c4
# dcrm_getCurNodeSignInfo = [{"Account":"0x00c37841378920E2BA5151a5d1E074Cf367586c4","GroupId":"ce4a50a5ffd8e9d3613aa1c5331c6fb8dd22ee89e9fde4538c7aa937cec5b1c6668c6baee58c7da22d2210370eceac88df445a6d0d90935b0da96da5e4f3f4e4","Key":"0x959f90765abcb08bbd596b268c731aeb2869f9ddc0de3cb4c700dedd265b864d","KeyType":"ECDSA","Mode":"0","MsgContext":["smpcwallet.com"],"MsgHash":["0xb55aab117b3c74cc8957d3a7d394379bfae5e81aa752e3151c7d5b541b166076"],"Nonce":"0","PubKey":"0430a9302e7938c3c57d6283299c53c34afa741b087c01f09a39a8c6a1cd145e70b83785a6c78c0d257277d8f1bc3d34e1a6b088c5d1e0e69eb3670b1e88724e0a","ThresHold":"2/3","TimeStamp":"1632815823952"}]

# SignTx:
# ChainId		=30400
# Gas		=100000
# GasPrice	=80000
# Nonce		=0
# ToAddr		=0x00000000000000000000000000000000000000dc
# Hash		=0x09ff8ded9fea35b2454f74bd1e1ab9764b8188f4d6876d1407df3b4dbd5af09a
# Data		={"TxType":"ACCEPTSIGN","Key":"0x959f90765abcb08bbd596b268c731aeb2869f9ddc0de3cb4c700dedd265b864d","Accept":"AGREE","MsgHash":["0xb55aab117b3c74cc8957d3a7d394379bfae5e81aa752e3151c7d5b541b166076"],"MsgContext":["smpcwallet.com"],"TimeStamp":"1632816227532"}
# RawTransaction = 0xf901678083013880830186a09400000000000000000000000000000000000000dc80b901007b22547854797065223a224143434550545349474e222c224b6579223a22307839353966393037363561626362303862626435393662323638633733316165623238363966396464633064653363623463373030646564643236356238363464222c22416363657074223a224147524545222c224d736748617368223a5b22307862353561616231313762336337346363383935376433613764333934333739626661653565383161613735326533313531633764356235343162313636303736225d2c224d7367436f6e74657874223a5b22736d706377616c6c65742e636f6d225d2c2254696d655374616d70223a2231363332383136323237353332227d82eda4a0010f43953b798ea3c3b8ce22def2d9e6ff768dd54026f654fe1260c77e9f6262a062b0c110328ccdc159b6acb3b3ae677fc2e5cb30505aa0c95be8c9b31ada9837

# dcrm_acceptSign result: key[2]	0x959f90765abcb08bbd596b268c731aeb2869f9ddc0de3cb4c700dedd265b864d = Success
```

12. 查詢簽名後的RSV

```sh
curl -X POST -H "Content-Type":application/json --data '{"jsonrpc":"2.0","method":"dcrm_getSignStatus","params":["0x959f90765abcb08bbd596b268c731aeb2869f9ddc0de3cb4c700dedd265b864d"],"id":67}' http://127.0.0.1:4449

# return
# {
#     "jsonrpc": "2.0",
#     "id": 64,
#     "result": {
#         "Data": {
#             "result": "{\"Status\":\"Success\",\"Rsv\":[\"75B87AF69A19A95C1EB703999C119AF6C2F38D2B19311D17E07209BF9EE9ABCE32F6BC5F4AF7BBBDAD3122C77CDCBA57FF86F289941C3B4D9E0827AD0ACFEB6C01\"],\"Tip\":\"\",\"Error\":\"\",\"AllReply\":[{\"Enode\":\"382ce5b84d287ec9afbd703c43e4ee4e8f6770a77571868d0884674ac2d871c4ae8bb1adb17894a6aed4ab69ee41f2c26eebb66351ffd97bf8f1bd4c45e04f25\",\"Status\":\"Agree\",\"TimeStamp\":\"1632816227532\",\"Initiator\":\"1\"},{\"Enode\":\"408f18b2e9ee70708283140d4eb0e91d88327c2950865c48b80320bd76f5b6b18bac53743db67fe50cd2ec07cf0d301b36b96b7c768a897de02471e7c8312294\",\"Status\":\"Agree\",\"TimeStamp\":\"1632816227532\",\"Initiator\":\"0\"},{\"Enode\":\"32cb2950bbdef82de50493753d03ad339fa1a96636fdb12f5b937f3a949d4b10c65d683ce8c88725e0d4ba98ab5827f43a65162064b4ce1e98b1554d7e5d2b07\",\"Status\":\"Agree\",\"TimeStamp\":\"1632816227532\",\"Initiator\":\"0\"}],\"TimeStamp\":\"1632815823952\"}"
#         },
#         "Error": "",
#         "Status": "Success",
#         "Tip": ""
#     }
# }
```

## reference

- [測試步驟](https://gist.github.com/zhaojun-sh/f7d23bb9ae14b6275053aabafec0a787)

- [json rpc api](https://github.com/fsn-dev/dcrm-walletService/wiki/walletService-RPC-API#dcrm_getReqAddrStatus)