'use strict';

const {operator} = require('putout');
const {insertBefore, remove} = operator;

module.exports.report = () => `Sort imports by specifiers count`;

module.exports.fix = ({path, nextPath}) => {
    const {node} = nextPath;
    remove(nextPath);
    insertBefore(path, node);
};

module.exports.traverse = ({push}) => ({
    ImportDeclaration(path) {
        const {source, specifiers} = path.node;
        
        if (specifiers.length < 4)
            return;
        
        const nextPath = path.getNextSibling();
        
        if (!nextPath.isImportDeclaration())
            return;
        
        if (nextPath.node.specifiers.length !== 1)
            return;
        
        if (!source.value.startsWith('./') && nextPath.node.source.value.startsWith('./'))
            return;
        
        if (source.value.startsWith('node:') && !nextPath.node.source.value.startsWith('node:'))
            return;
        
        push({
            path,
            nextPath,
        });
    },
});
