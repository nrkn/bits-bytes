import { ValueStrategy } from './types';
export declare const pack: (data: [number, number][], bytes?: Uint8Array, bitOffset?: number, byteOffset?: number, valueStrategy?: ValueStrategy) => void;
export declare const unpack: (data: Uint8Array, bitLengths: number[], bitOffset?: number, byteOffset?: number) => number[];
export declare const packSingle: (data: [number, number], bytes?: Uint8Array, bitOffset?: number, byteOffset?: number, valueStrategy?: ValueStrategy) => void;
export declare const unpackSingle: (data: Uint8Array, bitLength: number, bitOffset?: number, byteOffset?: number) => number[];
