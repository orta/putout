'use strict';

const {types, operator} = require('putout');
const {AwaitExpression} = types;
const {replaceWith} = operator;

module.exports.report = (path) => `Add missing parens: TypeError: '${path.get('argument.callee')}' is not a function`;

module.exports.fix = (path) => {
    const {argument} = path.node;
    const newPath = replaceWith(path, argument);
    const objectPath = newPath.get('expression.callee.object');
    
    path = replaceWith(objectPath, AwaitExpression(objectPath.node));
    
    path.node.extra = {
        parenthesized: true,
    };
};

module.exports.traverse = ({push}) => ({
    AwaitExpression(path) {
        const argPath = path.get('argument');
        
        if (argPath.isOptionalCallExpression() && argPath.get('callee').isOptionalMemberExpression())
            push(path);
    },
});
