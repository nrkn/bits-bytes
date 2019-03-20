"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countBytes = (data) => exports.bitLengthToBytes(exports.countBits(data));
exports.countBits = (data) => data.reduce((sum, [bitLength]) => sum + bitLength, 0);
exports.maxValue = (bitLength) => Math.pow(2, bitLength);
exports.valueToBitLength = (value) => Math.ceil(Math.log(value) / Math.log(2));
exports.bitLengthToBytes = (bitLength) => Math.ceil(bitLength / 8);
exports.modStrategy = (value, bitLength) => value % exports.maxValue(bitLength);
exports.clampStrategy = (value, bitLength) => {
    const max = exports.maxValue(bitLength);
    return value < 0 ? 0 : value >= max ? max - 1 : value;
};
//# sourceMappingURL=util.js.map