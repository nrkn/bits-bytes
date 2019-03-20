"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countBytes = (pair) => exports.bitLengthToBytes(exports.countBits(pair));
exports.countBits = (pair) => pair.reduce((sum, [bitLength]) => sum + bitLength, 0);
exports.maxValue = (bitLength) => Math.pow(2, bitLength);
exports.valueToBitLength = (value) => value === 0 ? 1 : Math.ceil(Math.log(value + 1) / Math.log(2));
exports.bitLengthToBytes = (bitLength) => Math.ceil(bitLength / 8);
exports.modStrategy = (value, bitLength) => value % exports.maxValue(bitLength);
exports.clampStrategy = (value, bitLength) => {
    const max = exports.maxValue(bitLength);
    return value < 0 ? 0 : value >= max ? max - 1 : value;
};
exports.getBit = (bytes, bitOffset) => {
    const byteOffset = Math.floor(bitOffset / 8);
    const byteBitOffset = bitOffset % 8;
    const byte = bytes[byteOffset];
    return byte >> (8 - (byteBitOffset + 1)) & 1;
};
exports.setBit = (bytes, bitOffset, bit) => {
    const byteOffset = Math.floor(bitOffset / 8);
    const byteBitOffset = bitOffset % 8;
    const mask = 1 << (7 - byteBitOffset);
    if (bit) {
        bytes[byteOffset] |= mask;
    }
    else {
        bytes[byteOffset] &= ~mask;
    }
};
//# sourceMappingURL=util.js.map