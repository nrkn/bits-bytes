import * as assert from 'assert'
import { pack, unpack, packSingle, unpackSingle } from '..'
import { LengthValuePair } from '../types'
import { bitLengthToBytes, clampStrategy, valueToBitLength, maxValue, getBit, setBit } from '../util'

describe( 'bits-bytes', () => {
  const packData: LengthValuePair[] = [
    [ 3, 0b101 ],
    [ 7, 0b1000001 ],
    [ 17, 0b10000000000000001 ],
    [ 5, 0b10001 ],
    [ 15, 0b100000000000001 ],
    [ 9, 0b100000001 ],
    [ 13, 0b1000000000001 ]
  ]

  const bitLength = packData.reduce( ( sum, [ bitSize ] ) => bitSize + sum, 0 )
  const length = bitLengthToBytes( bitLength )
  const bitOffset = length * 8 - bitLength

  const packDataLengths = packData.map( ( [ bitLength ] ) => bitLength )
  const packDataValues = packData.map( ( [ , value ] ) => value )

  const packedBytes = new Uint8Array(
    [ 176, 96, 0, 49, 128, 3, 1, 128, 8 ]
  )

  const offsetBytes = new Uint8Array(
    [ 22, 12, 0, 6, 48, 0, 96, 48, 1 ]
  )

  describe( 'pack', () => {
    it( 'packs', () => {
      const packed = pack( packData )

      assert.deepEqual( packed, packedBytes )
    } )

    it( 'packs with a bit offset', () => {
      const packed = pack( packData, bitOffset )

      assert.deepEqual( packed, offsetBytes )
    } )

    it( 'packs into existing array', () => {
      const packed = new Uint8Array( length )

      pack( packData, 0, packed )

      assert.deepEqual( packed, packedBytes )
    })

    it( 'packs into existing array with offset', () => {
      const packed = new Uint8Array( length )

      pack( packData, bitOffset, packed )

      assert.deepEqual( packed, offsetBytes )
    } )

    it( 'packs single', () => {
      const packed = packSingle( [ 3, 0b101 ] )

      assert.deepEqual(
        packed,
        new Uint8Array([ 0b10100000 ])
      )
    })

    it( 'packs single with offset', () => {
      const packed = packSingle( [ 3, 0b101 ], 5 )

      assert.deepEqual(
        packed,
        new Uint8Array( [ 0b101 ] )
      )
    } )

    it( 'packs single into existing array', () => {
      const packed = new Uint8Array( length )

      let currentBit = 0

      packData.forEach( pair => {
        packSingle( pair, currentBit, packed )
        currentBit += pair[ 0 ]
      } )

      assert.deepEqual( packed, packedBytes )
    })
  } )

  describe( 'unpack', () => {
    it( 'unpacks', () => {
      const unpacked = unpack( packedBytes, packDataLengths )

      assert.deepEqual( unpacked, packDataValues )
    } )

    // it( 'unpack2', () => {
    //   const unpacked = unpack2( packedBytes, packDataLengths )

    //   assert.deepEqual( unpacked, packDataValues )
    // } )

    it( 'unpacks with a bit offset', () => {
      const unpacked = unpack( offsetBytes, packDataLengths, bitOffset )

      assert.deepEqual( unpacked, packDataValues )
    } )

    it( 'unpacks single', () => {
      const packed = packSingle( [ 3, 0b101 ] )
      const unpacked = unpackSingle( packed, 3 )

      assert.strictEqual( unpacked, 0b101 )
    })

    it( 'unpacks single with offset', () => {
      const packed = packSingle( [ 3, 0b101 ], 5 )
      const unpacked = unpackSingle( packed, 3, 5 )

      assert.strictEqual( unpacked, 0b101 )
    } )
  } )

  describe( 'strategy', () => {
    it( 'uses mod strategy by default', () => {
      const packed = packSingle( [ 2, 5 ] )
      const unpacked = unpackSingle( packed, 2 )

      assert.strictEqual( unpacked, 5 % 4 )
    })

    it( 'uses provided strategy', () => {
      const packed = packSingle( [ 2, 4 ], 0, undefined, clampStrategy )
      const unpacked = unpackSingle( packed, 2 )

      assert.strictEqual( unpacked, 3 )
    })
  })

  describe( 'util', () => {
    it( 'valueToBitLength', () => {
      const a = valueToBitLength( 255 )
      const b = valueToBitLength( 256 )

      assert.strictEqual( a, 8 )
      assert.strictEqual( b, 9 )
    })

    it( 'clampStrategy', () => {
      const a = clampStrategy( -1, 8 )
      const b = clampStrategy( 127, 8 )
      const c = clampStrategy( 256, 8 )

      assert.strictEqual( a, 0 )
      assert.strictEqual( b, 127 )
      assert.strictEqual( c, 255 )
    })

    it( 'getBit', () => {
      const bytes = new Uint8Array( 10 )

      for( let i = 0; i < 10; i++ ){
        bytes[ i ] = Math.floor( Math.random() * 256 )
      }

      let str = ''
      bytes.forEach( b => str += b.toString( 2 ).padStart( 8, '0' ) )

      let str2 = ''
      for( let i = 0; i < 80; i++ ){
        const bit = getBit( bytes, i )
        str2 += bit
      }

      assert.strictEqual( str, str2 )
    })

    it( 'setBit', () => {
      const expect = new Uint8Array( 10 )

      for ( let i = 0; i < 10; i++ ) {
        expect[ i ] = Math.floor( Math.random() * 256 )
      }

      const result = new Uint8Array( 10 )

      for ( let i = 0; i < 80; i++ ) {
        const bit = getBit( expect, i )

        setBit( result, i, bit )
      }

      assert.deepEqual( result, expect )
    })

    it( 'use utils to pack and unpack large number of arbitrary values', () => {
      const numbers: number[] = []

      for ( let i = 0; i < 1e5; i++ ) {
        const numBits = Math.floor( Math.random() * 31 ) + 1
        const value = Math.floor( Math.random() * maxValue( numBits ) )

        numbers.push( value )
      }

      const bitLengths = numbers.map( valueToBitLength )
      const pairs = numbers.map( n =>
        <LengthValuePair>[ valueToBitLength( n ), n ]
      )

      const packed = pack( pairs )
      const unpacked = unpack( packed, bitLengths )

      assert.deepEqual( unpacked, numbers )
    } )

    it( 'can use views to marshal between types', () => {
      const values = [ 2306, 11159840, maxValue( 32 ) - 1 ]

      const encodeUint32LE = ( value: number ) => {
        const buffer = new ArrayBuffer( 4 )
        const view = new DataView( buffer )

        view.setUint32( 0, value, true )

        return view.getInt32( 0 )
      }

      const decodeUint32LE = ( value: number ) => {
        const buffer = new ArrayBuffer( 4 )
        const view = new DataView( buffer )

        view.setInt32( 0, value )

        return view.getUint32( 0, true )
      }

      const packData = values.map(
        value => <LengthValuePair>[ 32, encodeUint32LE( value ) ]
      )

      const packed = pack( packData )
      const unpacked = unpack( packed, [ 32, 32, 32 ] )

      const result = unpacked.map( decodeUint32LE )

      assert.deepEqual( result, values )
    })
  })
} )
