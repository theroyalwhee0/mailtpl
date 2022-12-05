import { parse } from 'css';

export const styles = `
    h1 {
        -text-begin: '*** ';
        -text-end: ' ***\\n';
    }

    h2 {
        -text-begin: '** ';
        -text-end: ' **\\n';
    }

    h3,
    h4,
    h5,
    h6 {
        -text-begin: '* ';
        -text-end: ' *\\n';
    }

    strong,
    b {
        -text-begin: '*';
        -text-end: '*';
    }

    hr {
        -text-begin: '\\n------------------------------------------------------------------------------\\n\\n';
    }

    a {
        -text-end: ' ( ' attr(href) ' )';
    }

    li {
        -text-begin: '- ';
        -text-end: '\\n';
    }

    img {
        -text-begin: attr(alt);
        -text-end: '\\n';
    }

    p {
        -text-begin: '\\n';
        -text-end: '\\n\\n';
    }

    ul,
    header,
    footer,
    main,
    article,
    section,
    div {
        -text-end: '\\n';
    }

    svg,
    link,
    noscript,
    script,
    meta,
    style {
        -text-hide: true;
    }
`;

export default parse(styles); 
