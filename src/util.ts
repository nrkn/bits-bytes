import { LengthValue } from './types'

export const countBytes = ( data: LengthValue[] ) =>
  bitLengthToBytes( countBits( data ) )

export const countBits = ( data: LengthValue[] ) =>
  data.reduce( ( sum, [ bitLength ] ) => sum + bitLength, 0 )

export const maxValue = ( bitLength: number ) =>
  Math.pow( 2, bitLength )

export const valueToBitLength = ( value: number ) =>
  Math.ceil( Math.log( value ) / Math.log( 2 ) )

export const bitLengthToBytes = ( bitLength: number ) =>
  Math.ceil( bitLength / 8 )

export const modStrategy = ( value: number, bitLength: number ) =>
  value % maxValue( bitLength )

export const clampStrategy = ( value: number, bitLength: number ) => {
  const max = maxValue( bitLength )

  return value < 0 ? 0 : value >= max ? max - 1 : value
}
