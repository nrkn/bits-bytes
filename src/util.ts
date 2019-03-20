import { LengthValuePair } from './types'

export const countBytes = ( pair: LengthValuePair[] ) =>
  bitLengthToBytes( countBits( pair ) )

export const countBits = ( pair: LengthValuePair[] ) =>
  pair.reduce( ( sum, [ bitLength ] ) => sum + bitLength, 0 )

export const maxValue = ( bitLength: number ) =>
  Math.pow( 2, bitLength )

export const valueToBitLength = ( value: number ) =>
  value === 0 ? 1 : Math.ceil( Math.log( value + 1 ) / Math.log( 2 ) )

export const bitLengthToBytes = ( bitLength: number ) =>
  Math.ceil( bitLength / 8 )

export const modStrategy = ( value: number, bitLength: number ) =>
  value % maxValue( bitLength )

export const clampStrategy = ( value: number, bitLength: number ) => {
  const max = maxValue( bitLength )

  return value < 0 ? 0 : value >= max ? max - 1 : value
}

export const getBit = ( bytes: Uint8Array, bitOffset: number ) => {
  const byteOffset = Math.floor( bitOffset / 8 )
  const byteBitOffset = bitOffset % 8
  const byte = bytes[ byteOffset ]

  return byte >> ( 8 - ( byteBitOffset + 1 ) ) & 1
}

export const setBit = ( bytes: Uint8Array, bitOffset: number, bit: any ) => {
  const byteOffset = Math.floor( bitOffset / 8 )
  const byteBitOffset = bitOffset % 8
  const mask = 1 << ( 7 - byteBitOffset )

  if( bit ){
    bytes[ byteOffset ] |= mask
  } else {
    bytes[ byteOffset ] &= ~mask
  }
}
