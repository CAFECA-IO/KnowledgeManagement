const OPS = require('bitcoin-ops');
const secp256k1 = require('secp256k1');
const bip66 = require('bip66');
const bs58check = require('bs58check');
const varuint = require('varuint-bitcoin');
const pushdata = require('pushdata-bitcoin');
const { sha256, hash160 } = require('./Crypto');
const BufferCursor = require('./BufferCursor');

// //////////////////////////////////////////////////////////

// 1: create base tx
const tx = {
  version: 2, locktime: 0, vins: [], vouts: [], witnesses: [],
};

// 2: add inputs
const privKey = Buffer.from(
  'ad1291be2fdbc9d29e1eeaa9e483697606006a2ac740c35e61216dd15b0758c1',
  'hex',
);
const pubKey = Buffer.from(secp256k1.publicKeyCreate(privKey));
tx.vins.push({
  txid: Buffer.from('ae11664352c4e7e9307ec45f5330ca96288e453979dc69af4525b7c5a96e6029', 'hex'),
  vout: 0,
  hash: Buffer.from('ae11664352c4e7e9307ec45f5330ca96288e453979dc69af4525b7c5a96e6029', 'hex').reverse(),
  sequence: 0xffffffff,
  script: p2wpkhScript(hash160(pubKey)),
  scriptSig: Buffer.alloc(0),
});

tx.vins.push({
  txid: Buffer.from('ae11664352c4e7e9307ec45f5330ca96288e453979dc69af4525b7c5a96e6029', 'hex'),
  vout: 1,
  hash: Buffer.from('ae11664352c4e7e9307ec45f5330ca96288e453979dc69af4525b7c5a96e6029', 'hex').reverse(),
  sequence: 0xffffffff,
  script: p2wpkhScript(hash160(pubKey)),
  scriptSig: Buffer.alloc(0),
});

// tx.vins.push({
//   txid: Buffer.from('ae11664352c4e7e9307ec45f5330ca96288e453979dc69af4525b7c5a96e6029', 'hex'),
//   vout: 2,
//   hash: Buffer.from('ae11664352c4e7e9307ec45f5330ca96288e453979dc69af4525b7c5a96e6029', 'hex').reverse(),
//   sequence: 0xffffffff,
//   script: p2pkhScript(hash160(pubKey)),
//   scriptSig: null,
// });

// 3: add output for new address
tx.vouts.push({
  script: p2wpkhScript(hash160(pubKey)),
  value: 1000,
});

// 4: add output for change address
// tx.vouts.push({
//   script: p2pkhScript(hash160(pubKey)),
//   value: 23000,
// });

// 5: now that tx is ready, sign and create script sig
for (let i = 0; i < tx.vins.length; i++) {
  tx.vins[i].scriptSig = Buffer.alloc(0);
  tx.witnesses.push(p2pkhScriptSig(signp2pkh(tx, i, privKey, 0x1), pubKey));
}

// 6: to hex
const result = txToBuffer(tx, false).toString('hex');
console.log(result);
console.log(
  result
    === '020000000229606ea9c5b72545af69dc7939458e2896ca30535fc47e30e9e7c452436611ae010000006b483045022100d965d9961446555cc840c4fe63306c6cb4be9b644684ceeb3568a6cbbd72377702207f84fa1000a3a06931299f1ed6c56cf2e72036757c463521d88b690baad1598e0121025304b56dc81a65d5513b0ff6a33651433735ecb5066f9d58a8902cb1a056459cffffffff29606ea9c5b72545af69dc7939458e2896ca30535fc47e30e9e7c452436611ae020000006a4730440220106d905d82c7b3b434c51826c44f4cb643acd03eeab0c989ba28c4e931b3db15022019b08973cc25f4f5d2e6db63fa6c4d3c3793ef233313ec0437755c575313853b0121025304b56dc81a65d5513b0ff6a33651433735ecb5066f9d58a8902cb1a056459cffffffff02f4010000000000001976a91421fafc89027872036072ba1d82271810b040713b88acf4010000000000001976a91421fafc89027872036072ba1d82271810b040713b88ac00000000',
);

// bitcoin-cli -testnet sendrawtransaction "02000000039e7cc02d7c039221a9a3d86a2f4ec32fd72ed10bb207dbbf71df6b30261b8698010000006a47304402201319297575c1f9e7151f51a2740c68463e8fd427d45347f098992f9cb9f7cb3802205dff79ea44f41721edbe98b86c0198e5318a8f860d99356d505e48e8902f23660121025304b56dc81a65d5513b0ff6a33651433735ecb5066f9d58a8902cb1a056459cffffffff39d24617a06eae25bd1f49dd06faddd90f37172b1511a3c4b22f2ede1f6e7636010000006b48304502210081e883453bf3c68a43a3a6905ecf8b3398215d7ee7ac239eac6b2d3e183128190220028a232419e70b0ea0c0862261f66e44d1b221e7936625e911e7d27102a1e0820121025304b56dc81a65d5513b0ff6a33651433735ecb5066f9d58a8902cb1a056459cffffffff1bcc8a94f3222b3ae19bd1f58beff7d3b0b0ca6524e53ed64a0c089b81e406f5010000006a4730440220645ac5f96ab95244df439ffbd5e82bfc50a6dad553bc93a3708172f0a4c8c795022026742fb4c88696e0cce687a6da67b66599a7b1964ea2de218942cc83ff8902160121025304b56dc81a65d5513b0ff6a33651433735ecb5066f9d58a8902cb1a056459cffffffff0264000000000000001976a9146aad0062d403b7b5a417e608b20b45a7e5a210e988ac78690000000000001976a91421fafc89027872036072ba1d82271810b040713b88ac00000000"
// txid: 18dc4ec8eca873f93fcc4869f6eaf0624ca91efff0ad86c341cd7edd37a8ae35

// /////////////////////////////////////////////////////////

function cloneBuffer(buffer) {
  const result = Buffer.alloc(buffer.length);
  buffer.copy(result);
  return result;
}

function cloneTx(tx) {
  const result = {
    version: tx.version, locktime: tx.locktime, vins: [], vouts: [],
  };
  for (const vin of tx.vins) {
    result.vins.push({
      txid: cloneBuffer(vin.txid),
      vout: vin.vout,
      hash: cloneBuffer(vin.hash),
      sequence: vin.sequence,
      script: cloneBuffer(vin.script),
      scriptPub: null,
    });
  }
  for (const vout of tx.vouts) {
    result.vouts.push({
      script: cloneBuffer(vout.script),
      value: vout.value,
    });
  }
  result.witnesses = tx.witnesses;
  return result;
}

// refer to https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/script.js#L35
function compileScript(chunks) {
  function asMinimalOP(buffer) {
    if (buffer.length === 0) return OPS.OP_0;
    if (buffer.length !== 1) return;
    if (buffer[0] >= 1 && buffer[0] <= 16) return OPS.OP_RESERVED + buffer[0];
    if (buffer[0] === 0x81) return OPS.OP_1NEGATE;
  }

  const bufferSize = chunks.reduce((accum, chunk) => {
    // data chunk
    if (Buffer.isBuffer(chunk)) {
      // adhere to BIP62.3, minimal push policy
      if (chunk.length === 1 && asMinimalOP(chunk) !== undefined) {
        return accum + 1;
      }
      return accum + pushdata.encodingLength(chunk.length) + chunk.length;
    }
    // opcode
    return accum + 1;
  }, 0.0);

  const buffer = Buffer.alloc(bufferSize);
  let offset = 0;

  chunks.forEach((chunk) => {
    // data chunk
    if (Buffer.isBuffer(chunk)) {
      // adhere to BIP62.3, minimal push policy
      const opcode = asMinimalOP(chunk);
      if (opcode !== undefined) {
        buffer.writeUInt8(opcode, offset);
        offset += 1;
        return;
      }

      offset += pushdata.encode(buffer, chunk.length, offset);
      chunk.copy(buffer, offset);
      offset += chunk.length;

      // opcode
    } else {
      buffer.writeUInt8(chunk, offset);
      offset += 1;
    }
  });
  if (offset !== buffer.length) throw new Error('Could not decode chunks');
  return buffer;
}

// refer to https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/address.js
function fromBase58Check(address) {
  const payload = bs58check.decode(address);
  const version = payload.readUInt8(0);
  const hash = payload.slice(1);
  return { version, hash };
}

// refer to https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/address.js
// function toBase58Check(privKey, version = 0x6f) {
//   let buffer = Buffer.alloc(21);
//   buffer.writeInt8(version);
//   hash160(secp256k1.publicKeyCreate(privKey)).copy(buffer, 1);
//   return bs58check.encode(buffer);
// }

// refer to https://en.bitcoin.it/wiki/Transaction#General_format_of_a_Bitcoin_transaction_.28inside_a_block.29
function calcTxBytes(forSign, vins, vouts, witnesses) {
  let totalLength = 4 // version
  + varuint.encodingLength(vins.length)
  + vins
    .map((vin) => (vin.scriptSig ? vin.scriptSig.length : vin.script.length))
    .reduce((sum, len) => sum + 40 + varuint.encodingLength(len) + len, 0)
  + varuint.encodingLength(vouts.length)
  + vouts
    .map((vout) => vout.script.length)
    .reduce((sum, len) => sum + 8 + varuint.encodingLength(len) + len, 0)
  + 4; // locktime

  if (!forSign) {
    totalLength += 2 // flag & mark
    + varuint.encodingLength(witnesses.length)
    + witnesses
      .map((witness) => (witness.length))
      .reduce((sum, len) => sum + 1 + len, 0);
  }

  return totalLength;
}

function txToBuffer(tx, forSign) {
  const buffer = Buffer.alloc(calcTxBytes(forSign, tx.vins, tx.vouts, tx.witnesses));
  const cursor = new BufferCursor(buffer);

  // version
  cursor.writeInt32LE(tx.version);

  // flag & mark
  if (!forSign) { cursor.writeBytes(Buffer.from('0001', 'hex')); }

  // vin length
  cursor.writeBytes(varuint.encode(tx.vins.length));

  // vin
  for (const vin of tx.vins) {
    cursor.writeBytes(vin.hash);
    cursor.writeUInt32LE(vin.vout);
    if (!forSign) {
      cursor.writeBytes(varuint.encode(vin.scriptSig.length));
      cursor.writeBytes(vin.scriptSig);
    } else {
      cursor.writeBytes(varuint.encode(vin.script.length));
      cursor.writeBytes(vin.script);
    }
    cursor.writeUInt32LE(vin.sequence);
  }

  // vout length
  cursor.writeBytes(varuint.encode(tx.vouts.length));

  // vouts
  for (const vout of tx.vouts) {
    cursor.writeUInt64LE(vout.value);
    cursor.writeBytes(varuint.encode(vout.script.length));
    cursor.writeBytes(vout.script);
  }

  if (!forSign) {
    for (const witness of tx.witnesses) {
      cursor.writeBytes(varuint.encode(2));
      cursor.writeBytes(witness);
    }
  }

  // locktime
  cursor.writeUInt32LE(tx.locktime);

  return buffer;
}

// refer to: https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/script_signature.js
function toDER(x) {
  let i = 0;
  while (x[i] === 0) ++i;
  if (i === x.length) return Buffer.alloc(1);
  x = x.slice(i);
  if (x[0] & 0x80) return Buffer.concat([Buffer.alloc(1), x], 1 + x.length);
  return x;
}

// refer to: https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/script_signature.js
function encodeSig(signature, hashType) {
  const hashTypeMod = hashType & ~0x80;
  if (hashTypeMod <= 0 || hashTypeMod >= 4) throw new Error(`Invalid hashType ${hashType}`);

  const hashTypeBuffer = Buffer.from([hashType]);

  const r = toDER(signature.slice(0, 32));
  const s = toDER(signature.slice(32, 64));

  return Buffer.concat([bip66.encode(r, s), hashTypeBuffer]);
}

// ///////////////////////////////////////

function signp2pkh(tx, vindex, privKey, hashType = 0x01) {
  const clone = cloneTx(tx);

  // clean up relevant script
  const filteredPrevOutScript = clone.vins[vindex].script.filter((op) => op !== OPS.OP_CODESEPARATOR);
  clone.vins[vindex].script = filteredPrevOutScript;

  // zero out scripts of other inputs
  for (let i = 0; i < clone.vins.length; i++) {
    if (i === vindex) continue;
    clone.vins[i].script = Buffer.alloc(0);
  }

  // write to the buffer
  let buffer = txToBuffer(clone, true);

  // extend and append hash type
  buffer = Buffer.alloc(buffer.length + 4, buffer);

  // append the hash type
  buffer.writeInt32LE(hashType, buffer.length - 4);

  console.log('tx before hash:', buffer.toString('hex'));

  // double-sha256
  const hash = sha256(sha256(buffer));

  console.log('hash', hash.toString('hex'));

  // sign input
  const sig = secp256k1.ecdsaSign(hash, privKey);

  // encode
  return encodeSig(Buffer.from(sig.signature), hashType);
}

function p2pkhScriptSig(sig, pubkey) {
  console.log('pubkey', pubkey);
  return compileScript([sig, pubkey]);
}

// Refer to:
// https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/payments/p2pkh.js#L58
function p2pkhScript(hash160PubKey) {
  // prettier-ignore
  return compileScript([
    OPS.OP_DUP,
    OPS.OP_HASH160,
    hash160PubKey,
    OPS.OP_EQUALVERIFY,
    OPS.OP_CHECKSIG,
  ]);
}

function p2wpkhScript(hash160PubKey) {
  // prettier-ignore
  return compileScript([
    OPS.OP_0,
    hash160PubKey,
  ]);
}
