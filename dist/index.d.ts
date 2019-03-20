import { ValueStrategy } from './types';
export declare const pack: (pairs: [number, number][], bitOffset?: number, bytes?: Uint8Array, valueStrategy?: ValueStrategy) => Uint8Array;
export declare const unpack: (data: Uint8Array, bitLengths: number[], bitOffset?: number) => number[];
export declare const packSingle: (pair: [number, number], bitOffset?: number, bytes?: Uint8Array, valueStrategy?: ValueStrategy) => Uint8Array;
export declare const unpackSingle: (data: Uint8Array, bitLength: number, bitOffset?: number) => number;
