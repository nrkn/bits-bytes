"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
// adapted from http://number-none.com/product/Packing%20Integers/index.html
exports.pack = (pairs, bitOffset = 0, bytes = new Uint8Array(util_1.countBytes(pairs)), valueStrategy = util_1.modStrategy) => {
    for (let i = 0; i < pairs.length; i++) {
        let bitLength = pairs[i][0];
        const value = valueStrategy(pairs[i][1], bitLength);
        while (bitLength > 0) {
            const byteIndex = Math.floor(bitOffset / 8);
            const bitIndex = bitOffset % 8;
            const sourceMask = (1 << (bitLength - 1));
            const destMask = (1 << (7 - bitIndex));
            if (value & sourceMask)
                bytes[byteIndex] |= destMask;
            bitOffset++;
            bitLength--;
        }
    }
    return bytes;
};
exports.unpack = (data, bitLengths, bitOffset = 0) => {
    const { length } = bitLengths;
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
        const bitLength = bitLengths[i];
        let value = 0;
        for (let j = 0; j < bitLength; j++) {
            value += util_1.getBit(data, bitOffset + j) << (bitLength - j - 1);
        }
        result[i] = value;
        bitOffset += bitLength;
    }
    return result;
};
exports.packSingle = (pair, bitOffset = 0, bytes = new Uint8Array(util_1.countBytes([pair])), valueStrategy = util_1.modStrategy) => exports.pack([pair], bitOffset, bytes, valueStrategy);
exports.unpackSingle = (data, bitLength, bitOffset = 0) => exports.unpack(data, [bitLength], bitOffset)[0];
//# sourceMappingURL=index.js.map