import { LengthValue, ValueStrategy } from './types'
import { countBytes, modStrategy, maxValue } from './util'

// adapted from http://number-none.com/product/Packing%20Integers/index.html
export const pack = (
  data: LengthValue[],
  bytes: Uint8Array = new Uint8Array( countBytes( data ) ),
  bitOffset = 0, byteOffset = 0,
  valueStrategy: ValueStrategy = modStrategy
) => {
  bitOffset = bitOffset + byteOffset * 8

  for ( let i = 0; i < data.length; i++ ) {
    let bitLength = data[ i ][ 0 ]
    const value = valueStrategy( data[ i ][ 1 ], bitLength )

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
}

export const unpack = (
  data: Uint8Array, bitLengths: number[], bitOffset = 0, byteOffset = 0
) => {
  bitOffset = bitOffset + byteOffset * 8

  const { length } = bitLengths
  const result: number[] = new Array<number>( length )

  for ( let i = 0; i < length; i++ ) {
    const bitLength = bitLengths[ i ]

    const byteIndex = Math.floor( bitOffset / 8 )
    const bitIndex = bitOffset % 8
    let value: number

    if ( ( bitOffset + bitLength ) > 16 ) {
      value = (
        (
          data[ byteIndex ] << 16 |
          data[ byteIndex + 1 ] << 8 |
          data[ byteIndex + 2 ]
        ) >> ( 24 - bitIndex - bitLength )
      ) & ( maxValue( bitLength ) - 1 )
    } else if ( ( bitOffset + bitLength ) > 8 ) {
      value = (
        (
          data[ byteIndex ] << 8 |
          data[ byteIndex + 1 ]
        ) >> ( 16 - bitIndex - bitLength )
      ) & lookup[ bitLength ]
    } else {
      value = (
        data[ byteIndex ] >> ( 8 - bitOffset - bitLength )
      ) & lookup[ bitLength ]
    }

    result[ i ] = value
    bitOffset += bitLength
  }

  return result
}

export const packSingle = (
  data: LengthValue,
  bytes: Uint8Array = new Uint8Array( countBytes( [ data ] ) ),
  bitOffset = 0, byteOffset = 0,
  valueStrategy: ValueStrategy = modStrategy
) => pack( [ data ], bytes, bitOffset, byteOffset, valueStrategy )

export const unpackSingle = (
  data: Uint8Array, bitLength: number, bitOffset = 0, byteOffset = 0
) =>
  unpack( data, [ bitLength ], bitOffset, byteOffset )

const lookup = [
  0x0, 0x1, 0x3, 0x7, 0xF, 0x1F, 0x3F, 0x7F, 0xFF, 0x1FF, 0x3FF, 0x7FF, 0xFFF,
  0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF
]
