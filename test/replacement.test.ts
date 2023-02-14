import { expect } from 'chai';
import { describe, it } from 'mocha';
import { replacementFactory } from '../src/replacement';

describe('replacementFactory', () => {
    it('should be a function', () => {
        expect(replacementFactory).to.be.a('function');
    });
    it('should build a function', () => {
        const replacer = replacementFactory();
        expect(replacer).to.be.a('function');
    });
    it('should handle an empty string', () => {
        const replacer = replacementFactory();
        const input = '';
        const data = {};
        const result = replacer(input, data);
        expect(result).to.equal('');
    });
    it('should handle a string with no replacement values', () => {
        const replacer = replacementFactory();
        const input = 'A couple of products were created to compete with the microcassette.';
        const data = {};
        const result = replacer(input, data);
        expect(result).to.equal('A couple of products were created to compete with the microcassette.');
    });
    it('should handle replacement value', () => {
        const replacer = replacementFactory();
        const input = 'A couple of products were created to compete with the $$item$$.';
        const data = {
            'item': 'microcassette',
            'cd': 'Compact Disc',
        };
        const result = replacer(input, data);
        expect(result).to.equal('A couple of products were created to compete with the microcassette.');
    });
    it('should throw if key is not found in data', () => {
        const replacer = replacementFactory();
        const input = 'A couple of products were created to compete with the $$item$$.';
        const data = {
            'cd': 'Compact Disc',
        };
        expect(() => {
            replacer(input, data);
        }).to.throw(/data does not have key "item"/);
    });
    it('should handle multiple replacement values with a single key', () => {
        const replacer = replacementFactory();
        const input = 'Say it: $$item$$, $$item$$, $$item$$';
        const data = {
            'item': 'microcassette',
            'cd': 'Compact Disc',
        };
        const result = replacer(input, data);
        expect(result).to.equal('Say it: microcassette, microcassette, microcassette');
    });
}); 
