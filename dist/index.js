"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
exports.getByteBit = (byte, bitOffset) => byte >> (8 - (bitOffset + 1)) & 1;
exports.setByteBit = (byte, bitOffset, bit) => bit ?
    byte |= 1 << (7 - bitOffset) :
    byte &= ~(1 << (7 - bitOffset));
exports.getBit = (bytes, bitOffset) => {
    const byteOffset = Math.floor(bitOffset / 8);
    return exports.getByteBit(bytes[byteOffset], bitOffset % 8);
};
exports.setBit = (bytes, bitOffset, bit) => {
    const byteOffset = Math.floor(bitOffset / 8);
    bytes[byteOffset] = exports.setByteBit(bytes[byteOffset], bitOffset %= 8, bit);
};
exports.getUint = (bytes, bitLength, bitOffset = 0) => {
    let uint = 0;
    for (let j = 0; j < bitLength; j++) {
        uint += exports.getBit(bytes, bitOffset + j) << (bitLength - j - 1);
    }
    return uint;
};
exports.setUint = (bytes, bitLength, uint, bitOffset = 0, valueStrategy = util_1.modStrategy) => {
    uint = valueStrategy(uint, bitLength);
    while (bitLength > 0) {
        const byteIndex = Math.floor(bitOffset / 8);
        const bitIndex = bitOffset % 8;
        const sourceMask = (1 << (bitLength - 1));
        const destMask = (1 << (7 - bitIndex));
        if (uint & sourceMask)
            bytes[byteIndex] |= destMask;
        bitOffset++;
        bitLength--;
    }
};
exports.unpack = (bytes, bitLengths, bitOffset = 0) => {
    const { length } = bitLengths;
    const values = [];
    for (let i = 0; i < length; i++) {
        const bitLength = bitLengths[i];
        values.push(exports.getUint(bytes, bitLength, bitOffset));
        bitOffset += bitLength;
    }
    return values;
};
exports.pack = (bytes, pairs, bitOffset = 0, valueStrategy = util_1.modStrategy) => {
    const { length } = pairs;
    for (let i = 0; i < length; i++) {
        const [bitLength, value] = pairs[i];
        exports.setUint(bytes, bitLength, value, bitOffset, valueStrategy);
        bitOffset += bitLength;
    }
};
//# sourceMappingURL=index.js.map