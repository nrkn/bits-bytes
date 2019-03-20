export declare const countBytes: (pair: [number, number][]) => number;
export declare const countBits: (pair: [number, number][]) => number;
export declare const maxValue: (bitLength: number) => number;
export declare const valueToBitLength: (value: number) => number;
export declare const bitLengthToBytes: (bitLength: number) => number;
export declare const modStrategy: (value: number, bitLength: number) => number;
export declare const clampStrategy: (value: number, bitLength: number) => number;
export declare const getBit: (bytes: Uint8Array, bitOffset: number) => number;
export declare const setBit: (bytes: Uint8Array, bitOffset: number, bit: any) => void;