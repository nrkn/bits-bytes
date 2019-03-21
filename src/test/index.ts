import * as assert from 'assert'
import * as numbers from './fixtures/numbers.json'

import { getBit, setBit, setUint, getUint, unpack, pack } from '..'
import { LengthValuePair } from '../types'
import { clampStrategy, valueToBitLength, maxValue, countBytes } from '../util'

describe( 'bits-bytes', () => {
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

  describe( 'getUint', () => {
    it( 'getUint', () => {
      const bytes = new Uint8Array( 1 )
      
      setUint( bytes, 3, 0b101 )

      const value = getUint( bytes, 3 )

      assert.strictEqual( value, 0b101 )
    })

    it( 'getUint with offset', () => {
      const bytes = new Uint8Array( 1 )
      
      setUint( bytes, 3, 0b101, 5 )

      const value = getUint( bytes, 3, 5 )

      assert.strictEqual( value, 0b101 )
    } )    
  })

  describe( 'setUint', () => {
    it( 'setUint', () => {
      const bytes = new Uint8Array( 1 )

      setUint( bytes, 3, 0b101 )

      assert.deepEqual(
        bytes,
        new Uint8Array([ 0b10100000 ])
      )
    })

    it( 'setUint with offset', () => {
      const bytes = new Uint8Array( 1 )

      setUint( bytes, 3, 0b101, 5 )

      assert.deepEqual(
        bytes,
        new Uint8Array( [ 0b101 ] )
      )
    } )
  })  

  describe( 'strategy', () => {
    it( 'uses mod strategy by default', () => {
      const bytes = new Uint8Array( 1 )

      setUint( bytes, 2, 5 )
      
      const value = getUint( bytes, 2 )

      assert.strictEqual( value, 5 % 4 )
    })

    it( 'uses provided strategy', () => {
      const bytes = new Uint8Array( 1 )

      setUint( bytes, 2, 5, 0, clampStrategy )
      
      const value = getUint( bytes, 2 )

      assert.strictEqual( value, 3 )
    })
  })

  describe( 'util', () => {
    it( 'valueToBitLength', () => {      
      const a = valueToBitLength( 255 )
      const b = valueToBitLength( 256 )
      const c = valueToBitLength( 0 )

      assert.strictEqual( a, 8 )
      assert.strictEqual( b, 9 )
      assert.strictEqual( c, 1 )
    })

    it( 'clampStrategy', () => {
      const a = clampStrategy( -1, 8 )
      const b = clampStrategy( 127, 8 )
      const c = clampStrategy( 256, 8 )

      assert.strictEqual( a, 0 )
      assert.strictEqual( b, 127 )
      assert.strictEqual( c, 255 )
    })

    it( 'use utils to pack and unpack large number of arbitrary values', () => {
      const pairs = numbers.map( n =>
        <LengthValuePair>[ valueToBitLength( n ), n ]
      )
      const bitLengths = pairs.map( ( [ bitLength ] ) => bitLength )

      const byteSize = countBytes( pairs )
      const bytes = new Uint8Array( byteSize )

      pack( bytes, pairs )

      const values = unpack( bytes, bitLengths )

      assert.deepEqual( values, numbers )
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

      const pairs = values.map(
        value => <LengthValuePair>[ 32, encodeUint32LE( value ) ]
      )

      const byteSize = countBytes( pairs )
      const bytes= new Uint8Array( byteSize )
      
      pack( bytes, pairs )
      
      const unpacked = unpack( bytes, [ 32, 32, 32 ] )

      const result = unpacked.map( decodeUint32LE )

      assert.deepEqual( result, values )
    })
  })
} )
