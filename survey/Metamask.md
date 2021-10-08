# Metamask
## Add Network
```javascript
const tidetime = {
  chainId: "0x1f51",
  chainName: "Tidetime",
  nativeCurrency: {
    name: "Tidetime Token",
    symbol: "TTT",
    decimals: 18
  },
  rpcUrls: ["https://rpc.tidebit.network"],
  iconUrls: ["https://iconape.com/wp-content/png_logo_vector/tidebit.png"]
}

ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [tidetime],
}).then((result) => {
  console.log(result)
  console.log('You can use Tidetime Chain now.')
}).catch((err) => {
  console.log(err);
  console.log('Something went wrong! You can not use Tidetime Chain.');
});
```

## Add ERC-20 Token
```javascript
const xpa = {
  type: 'ERC20',
  options: {
    address: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
    symbol: 'XPA',
    decimals: 18,
    image: 'https://xpa.exchange/img/logo_xpaex.png'
  }
}

ethereum.request({
  method: 'wallet_watchAsset',
  params: xpa
}).then((result) => {
  console.log(result);
  if (result) {
    console.log('XPA successfully added to wallet!')
  } else {
    throw new Error('Something went wrong.')
  }
}).catch((err) => {
  console.error(err);
})
```
