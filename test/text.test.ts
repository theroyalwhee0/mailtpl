import { expect } from 'chai';
import { describe, it } from 'mocha';
import { processTextTemplate } from '../src/text';
import { mockCheerioElement } from './mock/cheerio';

describe('processTextTemplate', () => {
    it('should be a function', () => {
        expect(processTextTemplate).to.be.a('function');
    });
    it('should process an empty template', () => {
        const ele = mockCheerioElement();
        const result = processTextTemplate(ele, '');
        expect(result).to.eql('');
    });
    it('should process an undefined template', () => {
        const ele = mockCheerioElement();
        const result = processTextTemplate(ele, undefined);
        expect(result).to.eql('');
    });
    it('should process a single quoted string', () => {
        const ele = mockCheerioElement();
        const result = processTextTemplate(ele, '\'the burgeoning Walkman market\'');
        expect(result).to.eql(
            'the burgeoning Walkman market',
        );
    });
    it('should process multiple single quoted strings', () => {
        const ele = mockCheerioElement();
        const result = processTextTemplate(ele, '\'Microcassettes have mostly \' \'been used for recording voice.\'');
        expect(result).to.eql(
            'Microcassettes have mostly been used for recording voice.',
        );
    });
    it('should process multiple single quoted strings', () => {
        const ele = mockCheerioElement('<a href="https://en.wikipedia.org/wiki/Microcassette">Microcassette</a>');
        const result = processTextTemplate(ele,
            '\'( \' attr(href) \' )\''
        );
        expect(result).to.eql(
            '( https://en.wikipedia.org/wiki/Microcassette )',
        );
    });
});
