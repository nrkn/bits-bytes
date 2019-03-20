import { LengthValuePair, ValueStrategy } from './types'
import { countBytes, modStrategy, getBit } from './util'

// adapted from http://number-none.com/product/Packing%20Integers/index.html
export const pack = (
  pairs: LengthValuePair[],
  bitOffset = 0,
  bytes: Uint8Array = new Uint8Array( countBytes( pairs ) ),
  valueStrategy: ValueStrategy = modStrategy
) => {
  for ( let i = 0; i < pairs.length; i++ ) {
    let bitLength = pairs[ i ][ 0 ]
    const value = valueStrategy( pairs[ i ][ 1 ], bitLength )

    while ( bitLength > 0 ) {
      const byteIndex = Math.floor( bitOffset / 8 )
      const bitIndex = bitOffset % 8
      const sourceMask = ( 1 << ( bitLength - 1 ) )
      const destMask = ( 1 << ( 7 - bitIndex ) )

      if ( value & sourceMask )
        bytes[ byteIndex ] |= destMask

      bitOffset++
      bitLength--
    }
  }

  return bytes
}

export const unpack = (
  data: Uint8Array, bitLengths: number[], bitOffset = 0
) => {
  const { length } = bitLengths
  const result: number[] = new Array<number>( length )

  for ( let i = 0; i < length; i++ ) {
    const bitLength = bitLengths[ i ]

    let value = 0
    for ( let j = 0; j < bitLength; j++ ) {
      value += getBit( data, bitOffset + j ) << ( bitLength - j - 1 )
    }

    result[ i ] = value
    bitOffset += bitLength
  }

  return result
}

export const packSingle = (
  pair: LengthValuePair,
  bitOffset = 0,
  bytes: Uint8Array = new Uint8Array( countBytes( [ pair ] ) ),
  valueStrategy: ValueStrategy = modStrategy
) => pack( [ pair ], bitOffset, bytes, valueStrategy )

export const unpackSingle = (
  data: Uint8Array, bitLength: number, bitOffset = 0
) =>
  unpack( data, [ bitLength ], bitOffset )[ 0 ]
