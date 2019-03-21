import { ValueStrategy } from './types';
export * from './util';
export declare const getByteBit: (byte: number, bitOffset: number) => number;
export declare const setByteBit: (byte: number, bitOffset: number, bit: any) => number;
export declare const getBit: (bytes: Uint8Array, bitOffset: number) => number;
export declare const setBit: (bytes: Uint8Array, bitOffset: number, bit: any) => void;
export declare const getUint: (bytes: Uint8Array, bitLength: number, bitOffset?: number) => number;
export declare const setUint: (bytes: Uint8Array, bitLength: number, uint: number, bitOffset?: number, valueStrategy?: ValueStrategy) => void;
export declare const unpack: (bytes: Uint8Array, bitLengths: number[], bitOffset?: number) => number[];
export declare const pack: (bytes: Uint8Array, pairs: [number, number][], bitOffset?: number, valueStrategy?: ValueStrategy) => void;
export declare const create: (pairs: [number, number][], bitOffset?: number, valueStrategy?: ValueStrategy) => Uint8Array;
