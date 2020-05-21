## EdDSA
由曲線和參數的選擇不同又可以劃分
- Ed25519
- Ed448
  
### Ed25519
>基於curve 25519
>> private key 64 bytes

1. 加密解密很快
2. 安全性高
 
- 產生 KeyPair
   - supercop.js https://github.com/1p6/supercop.js?files=1(目前用這個才和 AT.Wallet 的結果相同)
   - ed25519.js https://github.com/dazoe/ed25519(和 AT.Wallet 的結果不同)

- Convert Ed25519 signing key pair into Curve25519 key pair suitable for Diffie-Hellman key exchange
    - d2curve.js https://github.com/dchest/ed2curve-js
    - 由於 ed25519 privat key 長度為 64，需轉為 32
    
    
### curve25519
- shared key between own private key and peer's public key (in other words, this is an ECC Diffie-Hellman function X25519, performing scalar multiplication).
    - curve25519-js https://github.com/wavesplatform/curve25519-js
