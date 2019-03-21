# bits-bytes

Pack and unpack unsigned integers of arbitrary bit length to and from
byte arrays

`npm install bits-bytes`

Although this library supports bit lengths of up to around 32bits, it is 
primarily intended to make it easier to work with small bit sequences that don't 
necessarily align to byte fields - otherwise you're better off using DataView

## core

### getByteBit

Get a bit value from a byte - using numbers not in range 0-255 will produce
unexpected results

```ts
getByteBit( byte: number, bitOffset: number ) => 1 | 0
```

```js
const { getByteBit } = require( 'bits-bytes' )

// 1
console.log( getByteBit( 0b0001000, 3 ) )
```

### setByteBit

Set a bit value on a byte and return the new byte - using numbers not in range 
0-255 will produce unexpected results

```ts
setByteBit( byte: number, bitOffset: number, bit: any ) => number
```

```js
const { setByteBit } = require( 'bits-bytes' )

const byte = setByteBit( 0b0000000, 3, 1 )

// 1000
console.log( byte.toString( 2 ) )
```

### getBit

Get a bit within a byte array at the specified bit offset

```ts
getBit( bytes: Uint8Array, bitOffset: number ) => 1 | 0
```

```js
const { getBit } = require( 'bits-bytes' )

const bytes = new Uint8Array([ 0, 0b0001000 ])

// 1
console.log( getBit( bytes, 11 ) )
```

### setBit

Set a bit within a byte array at the specified bit offset - `bit` can be any
value, the bit will be set to `1` if truthy and `0` if falsey

```ts
setBit( bytes: Uint8Array, bitOffset: number, bit: any ) => void
```

```js
const { setBit } = require( 'bits-bytes' )

const bytes = new Uint8Array([ 0, 0 ])

setBit( bytes, 11, 1 )

// 1000
console.log( bytes[ 1 ].toString( 2 ) )
```

### getUint

Read a uint from the byte array of the specified bitLength from the specified 
bit offset - if not specified, `bitOffset` defaults to `0`

```ts
getUint( bytes: Uint8Array, bitLength: number, bitOffset = 0 ) => number
```

```js
const { getUint } = require( 'bits-bytes' )

const bytes = new Uint8Array([ 0b10110001 ])

const first = getUint( bytes, 3 )
const second = getUint( bytes, 5, 3 )

// 5
console.log( first )

// 17
console.log( second )
```

### setUint

Set a uint in the byte array of the specified bitLength and value at the
specified bit offset - if not specified, `bitOffset` defaults to `0`

`valueStrategy` is an optional function that handles values that are out of
range for the bit length - by default it uses `%` to wrap the number into the
required range - `clampStrategy` is also available and clamps the value into
the range `0-n` where `n` is the maximum value for that bit length

```ts
setUint( 
  bytes: Uint8Array, bitLength: number, uint: number, 
  bitOffset?  = 0,
  valueStrategy: ValueStrategy = modStrategy
) => void

type ValueStrategy = ( value: number, bitLength: number ) => number
```

```js
const { setUint, clampStrategy } = require( 'bits-bytes' )

const bytes = new Uint8Array( 2 )


setUint( bytes, 3, 5 )

// 1010000
console.log( bytes[ 0 ].toString( 2 ) )



setUint( bytes, 3, 5, 8 )

// 1010000
console.log( bytes[ 1 ].toString( 2 ) )


/*
  13 % 8 = 5, 0b101
*/
setUint( bytes, 3, 13 )

// 1010000
console.log( bytes[ 0 ].toString( 2 ) )

/*
  clamps to range 0-7, so 13 becomes 7
*/
setUint( bytes, 3, 13, 8, clampStrategy )

// 1110000
console.log( bytes[ 1 ].toString( 2 ) )
```

### unpack

Unpacks a sequence of uints from the byte array, where the bit lengths are 
specified in the `bitLengths` array, starting at the specified bit offset.
If omitted, `bitOffset` is 0

```ts
unpack(
  bytes: Uint8Array, bitLengths: number[], bitOffset = 0
) => number[]
```

```js
const { unpack } = require( 'bits-bytes' )

const bytes = new Uint8Array([ 0b10110001 ])

const values = unpack( bytes, [ 3, 5 ] )

// [ 5, 17 ]
console.log( values )
```

### pack

Packs a sequence of uints into the byte array, where `pairs` is an array of
`[ length, value ]` tuples, starting at the specified bit offset and using
an optional function `valueStrategy` to handle any values that fall outside of
the range for their bit length. If omitted, `bitOffset` is 0 and the 
`valueStrategy` uses `%` to wrap the number into the required range

```ts
pack(
  bytes: Uint8Array, pairs: LengthValuePair[], bitOffset = 0,
  valueStrategy: ValueStrategy = modStrategy
) => void

type LengthValuePair = [ number, number ]
```

```js
const { pack } = require( 'bits-bytes' )

const bytes = new Uint8Array( 2 )

const firstLength = 3
const firstValue = 5

const secondLength = 5
const secondValue = 17

const pairs = [
  [ firstLength, firstValue ],
  [ secondLength, secondValue ]
]

pack( bytes, pairs )

// 10110001
console.log( bytes[ 0 ].toString( 2 ) )

const secondBytePairs = [
  [ secondLength, secondValue ],
  [ firstLength, firstValue ]
]

pack( bytes, pairs, 8 )

// 10001101
console.log( bytes[ 1 ].toString( 2 ) )
```

### create

Creates a new Uint8Array and packs a sequence of uints into it, where `pairs` is 
an array of `[ length, value ]` tuples, starting at the specified bit offset and 
using an optional function `valueStrategy` to handle any values that fall 
outside of the range for their bit length. If omitted, `bitOffset` is 0 and the 
`valueStrategy` uses `%` to wrap the number into the required range

```ts
create(
  pairs: LengthValuePair[], 
  bitOffset = 0,
  valueStrategy: ValueStrategy = modStrategy
)
```

```js
const { create } = require( 'bits-bytes' )

const firstLength = 3
const firstValue = 5

const secondLength = 5
const secondValue = 17

const pairs = [
  [ firstLength, firstValue ],
  [ secondLength, secondValue ]
]


const bytes = create( pairs )

// 10110001
console.log( bytes[ 0 ].toString( 2 ) )
```

## utils

### countBytes

Counts the smallest numbers of bytes required to fit a sequence of uints

```ts
countBytes( bitLengths: number[] ) => number
```

```js
const { countBytes } = require( 'bits-bytes' )

// 1
console.log( countBytes( [ 3, 5 ] ) )

// 2
console.log( countBytes( [ 5, 5 ] ) )
```

### countBits

Sums an array of bit lengths

```ts
countBits( bitLengths: number[] ) => number
```

```js
const { countBits } = require( 'bits-bytes' )

// 8
console.log( countBits( [ 3, 5 ] ) )

// 10
console.log( countBits( [ 5, 5 ] ) )
```


### maxValue

The maximum number of different uint values that can be stored in a given number 
of bits - note that the highest allowed value is 1 less than this, as the range 
is `0-n`, not `1-n`

```ts
maxValue( bitLength: number ) => number
```

```js
const { maxValue } = require( 'bits-bytes' )

// 256
console.log( maxValue( 8 ) )
```

### valueToBitLength

Find the number of bits required to store a given uint value

```ts
valueToBitLength( value: number ) => number
```

```js
const { valueToBitLength } = require( 'bits-bytes' )

// 8
console.log( valueToBitLength( 255 ) )
// 9
console.log( valueToBitLength( 256 ) )
```

### bitLengthToBytes

Returns the number of bytes required to store the given number of bits

```ts
bitLengthToBytes( bitLength: number ) => number
```

```js
const { bitLengthToBytes } = require( 'bits-bytes' )

// 1
console.log( bitLengthToBytes( 8 ) )
// 2
console.log( bitLengthToBytes( 9 ) )
```

### modStrategy

Uses modulo to wrap the given value into the range specified by `bitLength`

```ts
modStrategy( value: number, bitLength: number ) => number
```

```js
const { modStrategy } = require( 'bits-bytes' )

// 255
console.log( modStrategy( 255, 8 ) )
// 0
console.log( modStrategy( 256, 8 ) )
// 1
console.log( modStrategy( 257, 8 ) )
```

### clampStrategy

Clamps the given value into the range `0-n`, where `n` is maximum value allowed 
for the specified `bitLength`

```ts
clampStrategy( value: number, bitLength: number ) => number
```

```js
const { clampStrategy } = require( 'bits-bytes' )

// 255
console.log( clampStrategy( 255, 8 ) )
// 0
console.log( clampStrategy( -63, 8 ) )
// 255
console.log( clampStrategy( 384, 8 ) )
```

## License

MIT License

Copyright (c) 2019 Nik Coughlin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.