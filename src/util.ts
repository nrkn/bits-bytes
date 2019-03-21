import { LengthValuePair } from './types'

export const countBytes = ( pairs: LengthValuePair[] ) =>
  bitLengthToBytes( countBits( pairs ) )

export const countBits = ( pairs: LengthValuePair[] ) =>
  pairs.reduce( ( sum, [ bitLength ] ) => sum + bitLength, 0 )

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

