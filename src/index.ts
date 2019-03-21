import { ValueStrategy, LengthValuePair } from './types'
import { modStrategy } from './util'

export const getByteBit = ( byte: number, bitOffset: number ) =>
  byte >> ( 8 - ( bitOffset + 1 ) ) & 1

export const setByteBit = ( byte: number, bitOffset: number, bit: any ) => 
  bit ?
  byte |= 1 << ( 7 - bitOffset ) :
  byte &= ~( 1 << ( 7 - bitOffset ) )

export const getBit = ( bytes: Uint8Array | number, bitOffset: number ) => {
  const byteOffset = Math.floor( bitOffset / 8 )
  
  return getByteBit( bytes[ byteOffset ], bitOffset % 8 )
}

export const setBit = ( bytes: Uint8Array, bitOffset: number, bit: any ) => {
  const byteOffset = Math.floor( bitOffset / 8 )

  bytes[ byteOffset ] = setByteBit( bytes[ byteOffset ], bitOffset %= 8, bit )
}

export const getUint = ( 
  bytes: Uint8Array, bitLength: number, bitOffset = 0 
) => {
  let uint = 0

  for ( let j = 0; j < bitLength; j++ ) {
    uint += getBit( bytes, bitOffset + j ) << ( bitLength - j - 1 )
  }

  return uint
}

export const setUint = ( 
  bytes: Uint8Array, bitLength: number, uint: number, bitOffset = 0,
  valueStrategy: ValueStrategy = modStrategy
) => {
  uint = valueStrategy( uint, bitLength )

  while ( bitLength > 0 ) {
    const byteIndex = Math.floor( bitOffset / 8 )
    const bitIndex = bitOffset % 8
    const sourceMask = ( 1 << ( bitLength - 1 ) )
    const destMask = ( 1 << ( 7 - bitIndex ) )

    if ( uint & sourceMask )
      bytes[ byteIndex ] |= destMask

    bitOffset++
    bitLength--
  }
}

export const unpack = (
  bytes: Uint8Array, bitLengths: number[], bitOffset = 0
) => {
  const { length } = bitLengths
  const values: number[] = []

  for( let i = 0; i < length; i++ ){
    const bitLength = bitLengths[ i ]

    values.push( getUint( bytes, bitLength, bitOffset ) )
    
    bitOffset += bitLength
  }
  
  return values
}

export const pack = (
  bytes: Uint8Array, pairs: LengthValuePair[], bitOffset = 0,
  valueStrategy: ValueStrategy = modStrategy
) => {
  const { length } = pairs
  
  for( let i = 0; i < length; i++ ){
    const [ bitLength, value ] = pairs[ i ]

    setUint( bytes, bitLength, value, bitOffset, valueStrategy )

    bitOffset += bitLength
  }
}
