'use strict';

const {
    types,
    operator,
} = require('putout');

const {replaceWith, getProperty} = operator;
const {StringLiteral} = types;

module.exports.report = () => `'lint' should be used instead of 'lint:lib'`;

module.exports.fix = ({lintLib, fixLint, lint}) => {
    replaceWith(lintLib.get('key'), lint.node.key);
    lint.remove();
    
    const {body} = fixLint.node.value;
    
    body.arguments[0] = StringLiteral('lint');
};

module.exports.traverse = ({push}) => ({
    'module.exports = __object'(path) {
        const rightPath = path.get('right');
        
        const lint = getProperty(rightPath, 'lint');
        const lintLib = getProperty(rightPath, 'lint:lib');
        const fixLint = getProperty(rightPath, 'fix:lint');
        
        if (!lint || !lintLib || !fixLint)
            return;
        
        push({
            path: rightPath,
            lint,
            lintLib,
            fixLint,
        });
    },
});

