import { expect } from 'chai';
import { parse as parseCss, Stylesheet } from 'css';
import { describe, it } from 'mocha';
import { buildFromString } from '../src/buildfromstring';

describe('buildFromString', () => {
    it('should be a function', () => {
        expect(buildFromString).to.be.a('function');
    });
    it('should build an empty template', () => {
        const result = buildFromString('');
        expect(result.subject()).to.equal(undefined);
        expect(result.html()).to.equal('');
    });
    it('should build a whitespace template', () => {
        const result = buildFromString(`
                        
        `);
        expect(result.subject()).to.equal(undefined);
        expect(result.html()).to.equal('');
    });
    it('should support mail/subject metadata values', () => {
        const result = buildFromString(`
            <meta name='mail/subject' value='Have you heard of Microcassettes?'>
        `);
        expect(result.subject()).to.equal('Have you heard of Microcassettes?');
        expect(result.ident()).to.equal(undefined);
        expect(result.fromEmail()).to.equal(undefined);
        expect(result.fromName()).to.equal(undefined);
        expect(result.html()).to.equal('');
    });
    it('should remove mail/* metadata values', () => {
        const result = buildFromString(`
            <meta name='mail/name' value='Microcassettes 2022'>
            <meta name='mail/ident' value='microcassettes-2022'>
            <meta name='mail/from-name' value='Rumble'>
            <meta name='mail/from-email' value='rumble@microcassettes.example'>
            <meta name='mail/subject' value='Have you heard of Microcassettes?'>
        `);
        expect(result.name()).to.equal('Microcassettes 2022');
        expect(result.subject()).to.equal('Have you heard of Microcassettes?');
        expect(result.ident()).to.equal('microcassettes-2022');
        expect(result.fromEmail()).to.equal('rumble@microcassettes.example');
        expect(result.fromName()).to.equal('Rumble');
        expect(result.html()).to.equal('');
    });
    it('should support mail/ident metadata values', () => {
        const result = buildFromString(`
            <meta name='mail/ident' value='microcassettes-2022'>
        `);
        expect(result.ident()).to.equal('microcassettes-2022');
        expect(result.html()).to.equal('');
    });
    it('should support mail/from-name metadata values', () => {
        const result = buildFromString(`
            <meta name='mail/from-name' value='Rumble'>
        `);
        expect(result.fromName()).to.equal('Rumble');
        expect(result.html()).to.equal('');
    });
    it('should support mail/from-email metadata values', () => {
        const result = buildFromString(`
            <meta name='mail/from-email' value='rumble@microcassettes.example'>
        `);
        expect(result.fromEmail()).to.equal('rumble@microcassettes.example');
        expect(result.html()).to.equal('');
    });
    it('should throw if there are repeat known metadata values', () => {
        expect(() => {
            buildFromString(`
                <meta name='mail/subject' value='Have you heard of Microcassettes?'>
                <meta name='mail/subject' value='Have you heard of Microcassettes!'>
            `);
        }).to.throw('Multiple meta "mail/subject" elements');
    });
    it('should support basic HTML', () => {
        const result = buildFromString(`
            <meta name='mail/subject' value='Have you heard of Microcassettes?'>
            <h1>A Microcassette is significantly smaller than a Compact Cassette</h1>
            <p>
                Microcassettes have mostly been used for recording voice. 
                In particular, they are commonly used in dictation machines 
                and answering machines.
            </p>
        `);
        expect(result.subject()).to.equal('Have you heard of Microcassettes?');
        expect(result.html()).to.equal(
            '<h1>A Microcassette is significantly smaller than a Compact Cassette</h1>\n' +
            '            <p>\n' +
            '                Microcassettes have mostly been used for recording voice. \n' +
            '                In particular, they are commonly used in dictation machines \n' +
            '                and answering machines.\n' +
            '            </p>'
        );
    });
    it('should support removing comments', () => {
        const result = buildFromString(`
            <h1>A Microcassette is significantly smaller than a Compact Cassette</h1>
            <!-- Microcassettes have mostly been used for recording voice.  -->
        `, {
            removeComments: true,
        });
        expect(result.subject()).to.equal(undefined);
        expect(result.html()).to.equal('<h1>A Microcassette is significantly smaller than a Compact Cassette</h1>');
    });
    it('should support removing ids', () => {
        const result = buildFromString(`
            <h1 id="topic-microcassette" class="block-header">A Microcassette is significantly smaller than a Compact Cassette</h1>
            <p class="block-text">Microcassettes have mostly been used for recording voice.</p>
        `, {
            removeIds: true,
            removeClasses: false,
        });
        expect(result.subject()).to.equal(undefined);
        expect(result.html()).to.equal(
            '<h1 class="block-header">A Microcassette is significantly smaller than a Compact Cassette</h1>\n' +
            '            <p class="block-text">Microcassettes have mostly been used for recording voice.</p>'
        );
    });
    it('should support removing classes', () => {
        const result = buildFromString(`
            <h1 id="topic-microcassette" class="block-header">A Microcassette is significantly smaller than a Compact Cassette</h1>
            <p class="block-text">Microcassettes have mostly been used for recording voice.</p>
        `, {
            removeClasses: true,
            removeIds: false,
        });
        expect(result.subject()).to.equal(undefined);
        expect(result.html()).to.equal(
            '<h1 id="topic-microcassette">A Microcassette is significantly smaller than a Compact Cassette</h1>\n' +
            '            <p>Microcassettes have mostly been used for recording voice.</p>'
        );
    });
    it('should support inline styles', () => {
        const result = buildFromString(`
            <style><!--
                h1 {
                    border-bottom: thin solid black;
                }
                p {
                    font-weight: normal;
                    color: #111;
                }
            --></style>
            <h1>A Microcassette is significantly smaller than a Compact Cassette</h1>
            <p>
                Microcassettes have mostly been used for recording voice. 
                In particular, they are commonly used in dictation machines 
                and answering machines.
            </p>
            <p style='line-height:90%'>
                Microcassettes have also been used in computer data storage and to record music.
            </p>
        `);
        expect(result.subject()).to.equal(undefined);
        expect(result.html()).to.equal(
            '<h1 style="border-bottom:thin solid black">A Microcassette is significantly smaller than a Compact Cassette</h1>\n' +
            '            <p style="font-weight:normal;color:#111">\n' +
            '                Microcassettes have mostly been used for recording voice. \n' +
            '                In particular, they are commonly used in dictation machines \n' +
            '                and answering machines.\n' +
            '            </p>\n' +
            '            <p style="line-height:90%;font-weight:normal;color:#111">\n' +
            '                Microcassettes have also been used in computer data storage and to record music.\n' +
            '            </p>'
        );
    });
    it('should support inline styles wrapped in comments', () => {
        const result = buildFromString(`
            <style><!--
                h1 {
                    border-bottom: thin solid black;
                }
            --></style>
            <h1>A Microcassette is significantly smaller than a Compact Cassette</h1>
        `);
        expect(result.subject()).to.equal(undefined);
        expect(result.html()).to.equal(
            '<h1 style="border-bottom:thin solid black">' +
            'A Microcassette is significantly smaller than a Compact Cassette' +
            '</h1>'
        );
    });
    it('should support attribute styles', () => {
        const result = buildFromString(`
            <style>
                table {
                    -attr-border: '0'; /* This will be made into an attribute */
                }
            </style>
            <table><tbody><tr><td>Microcassette</td></tr></tbody></table>
        `);
        expect(result.subject()).to.equal(undefined);
        expect(result.html()).to.equal(
            '<table border="0">' +
            '<tbody><tr><td>Microcassette</td></tr></tbody>' +
            '</table>'
        );
    });
    it('should support removing attribute styles', () => {
        const result = buildFromString(`
            <style>
                table {
                    -attr-border: false;
                }
            </style>
            <table border="0"><tbody><tr><td>Microcassette</td></tr></tbody></table>
        `);
        expect(result.subject()).to.equal(undefined);
        expect(result.html()).to.equal(
            '<table>' +
            '<tbody><tr><td>Microcassette</td></tr></tbody>' +
            '</table>'
        );
    });
    it('should support supplied stylesheets', () => {
        const result = buildFromString(`
            <style>
                h1 {
                    /** This will be applied last. */
                    border-left: 1px solid #444;
                }
            </style>        
            <h1>A Microcassette is significantly smaller than a Compact Cassette</h1>
        `, {
            // These will be applied in order.
            styles: [
                // Supports strings.
                'h1 { border-bottom: 1px solid #111; }',
                // Stylesheets
                parseCss('h1 { border-right: 1px solid #222; }'),
                // Stylesheet factories
                (): Stylesheet => parseCss('h1 { border-top: 1px solid #333; }'),
            ],
        });
        expect(result.subject()).to.equal(undefined);
        expect(result.html()).to.equal(
            '<h1 style="' +
            'border-bottom:1px solid #111;' +
            'border-right:1px solid #222;' +
            'border-top:1px solid #333;' +
            'border-left:1px solid #444' +
            '">' +
            'A Microcassette is significantly smaller than a Compact Cassette' +
            '</h1>'
        );
    });
    it('should support source and ident options', () => {
        const result = buildFromString(
            '<h1>The Microcassette (often written generically as microcassette) ' +
            'is an audio storage medium, introduced by Olympus in 1969.</h1>', {
            source: 'https://en.wikipedia.org/wiki/Microcassette',
            ident: 'microcassette-2022',
        });
        expect(result.html()).to.equal(
            '<h1>The Microcassette (often written generically as microcassette) ' +
            'is an audio storage medium, introduced by Olympus in 1969.</h1>'
        );
        expect(result.ident()).to.equal('microcassette-2022');
        expect(result.source()).to.equal('https://en.wikipedia.org/wiki/Microcassette');
    });
    it('should build text from HTML', () => {
        const result = buildFromString(`
            <h1>A Microcassette is significantly smaller than a Compact Cassette</h1>
            <p>
                Microcassettes have mostly been used for recording voice.<br>
                In particular, they are commonly used in 
                <a href="https://en.wikipedia.org/wiki/Dictation_machine">dictation machines</a>
                and answering machines.
            </p>
            <hr>
            <h3>Capacity</h3>
            <ul>
                <li>MC60 (30 min per side at 2.4 cm/s)</li>
                <li>MC10</li>
                <li>MC15</li>
                <li>MC30</li>
            </ul>
        `);
        const text = result.text();
        const expected = '*** A Microcassette is significantly smaller than a Compact Cassette ***\n' +
            '\n' +
            'Microcassettes have mostly been used for recording voice.\n' +
            'In particular, they are commonly used in dictation machines ' +
            '[ https://en.wikipedia.org/wiki/Dictation_machine ]' +
            ' and answering machines.\n\n' +
            '------------------------------------------------------------------------------\n\n' +
            '* Capacity *\n\n' +
            '- MC60 (30 min per side at 2.4 cm/s)\n' +
            '- MC10\n' +
            '- MC15\n' +
            '- MC30\n' +
            '';
        expect(text).to.equal(expected);
    });
});
