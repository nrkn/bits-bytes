"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const numbers = require("./fixtures/numbers.json");
const __1 = require("..");
const util_1 = require("../util");
describe('bits-bytes', () => {
    it('getBit', () => {
        const bytes = new Uint8Array(10);
        for (let i = 0; i < 10; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
        let str = '';
        bytes.forEach(b => str += b.toString(2).padStart(8, '0'));
        let str2 = '';
        for (let i = 0; i < 80; i++) {
            const bit = __1.getBit(bytes, i);
            str2 += bit;
        }
        assert.strictEqual(str, str2);
    });
    it('setBit', () => {
        const expect = new Uint8Array(10);
        for (let i = 0; i < 10; i++) {
            expect[i] = Math.floor(Math.random() * 256);
        }
        const result = new Uint8Array(10);
        for (let i = 0; i < 80; i++) {
            const bit = __1.getBit(expect, i);
            __1.setBit(result, i, bit);
        }
        assert.deepEqual(result, expect);
    });
    describe('getUint', () => {
        it('getUint', () => {
            const bytes = new Uint8Array(1);
            __1.setUint(bytes, 3, 0b101);
            const value = __1.getUint(bytes, 3);
            assert.strictEqual(value, 0b101);
        });
        it('getUint with offset', () => {
            const bytes = new Uint8Array(1);
            __1.setUint(bytes, 3, 0b101, 5);
            const value = __1.getUint(bytes, 3, 5);
            assert.strictEqual(value, 0b101);
        });
    });
    describe('setUint', () => {
        it('setUint', () => {
            const bytes = new Uint8Array(1);
            __1.setUint(bytes, 3, 0b101);
            assert.deepEqual(bytes, new Uint8Array([0b10100000]));
        });
        it('setUint with offset', () => {
            const bytes = new Uint8Array(1);
            __1.setUint(bytes, 3, 0b101, 5);
            assert.deepEqual(bytes, new Uint8Array([0b101]));
        });
    });
    describe('strategy', () => {
        it('uses mod strategy by default', () => {
            const bytes = new Uint8Array(1);
            __1.setUint(bytes, 2, 5);
            const value = __1.getUint(bytes, 2);
            assert.strictEqual(value, 5 % 4);
        });
        it('uses provided strategy', () => {
            const bytes = new Uint8Array(1);
            __1.setUint(bytes, 2, 5, 0, util_1.clampStrategy);
            const value = __1.getUint(bytes, 2);
            assert.strictEqual(value, 3);
        });
    });
    describe('util', () => {
        it('valueToBitLength', () => {
            const a = util_1.valueToBitLength(255);
            const b = util_1.valueToBitLength(256);
            const c = util_1.valueToBitLength(0);
            assert.strictEqual(a, 8);
            assert.strictEqual(b, 9);
            assert.strictEqual(c, 1);
        });
        it('clampStrategy', () => {
            const a = util_1.clampStrategy(-1, 8);
            const b = util_1.clampStrategy(127, 8);
            const c = util_1.clampStrategy(256, 8);
            assert.strictEqual(a, 0);
            assert.strictEqual(b, 127);
            assert.strictEqual(c, 255);
        });
        it('use utils to pack and unpack large number of arbitrary values', () => {
            const pairs = numbers.map(n => [util_1.valueToBitLength(n), n]);
            const bitLengths = pairs.map(([bitLength]) => bitLength);
            const byteSize = util_1.countBytes(pairs);
            const bytes = new Uint8Array(byteSize);
            __1.pack(bytes, pairs);
            const values = __1.unpack(bytes, bitLengths);
            assert.deepEqual(values, numbers);
        });
        it('can use views to marshal between types', () => {
            const values = [2306, 11159840, util_1.maxValue(32) - 1];
            const encodeUint32LE = (value) => {
                const buffer = new ArrayBuffer(4);
                const view = new DataView(buffer);
                view.setUint32(0, value, true);
                return view.getInt32(0);
            };
            const decodeUint32LE = (value) => {
                const buffer = new ArrayBuffer(4);
                const view = new DataView(buffer);
                view.setInt32(0, value);
                return view.getUint32(0, true);
            };
            const pairs = values.map(value => [32, encodeUint32LE(value)]);
            const byteSize = util_1.countBytes(pairs);
            const bytes = new Uint8Array(byteSize);
            __1.pack(bytes, pairs);
            const unpacked = __1.unpack(bytes, [32, 32, 32]);
            const result = unpacked.map(decodeUint32LE);
            assert.deepEqual(result, values);
        });
    });
});
//# sourceMappingURL=index.js.map