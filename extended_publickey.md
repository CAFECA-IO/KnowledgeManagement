[Extended Key](https://learnmeabitcoin.com/guide/extended-keys)
    
![](https://i.imgur.com/Inr4bjw.png)

    Use an index between 0 and 2147483647. Indexes in this range are designated for normal child extended keys.
1. Put data and key through HMAC.
    1. data = public key+index (concatenated)
    2. key = chain code
The new chain code is the last 32 bytes of the result from the HMAC. This will be the same chain code as the normal child extended private key above, because if you look back you will see that we put the same inputs in to the HMAC function.

The new public key is the original public key point added to the first 32 bytes of the result of the HMAC as a point on the curve (multiply by the generator to get this as a pont).

So in summary, we put the same data and key in to the HMAC function as we did when generating the child extended private key. We can then work out the child public key via elliptic curve point addition with the same first 32 bytes of the HMAC result (which means it corresponds to the private key in the child extended private key).
