'use strict';

const {types, operator} = require('putout');
const {isBuiltin} = require('node:module');
const {
    setLiteralValue,
    getTemplateValues,
} = operator;

const {isCallExpression} = types;

const REQUIRE = 'require("__a")';
const IMPORT = 'import("__a")';

module.exports.report = ({value}) => {
    return `Use 'node:${value}' instead of '${value}'`;
};

module.exports.fix = ({path, value}) => {
    if (isCallExpression(path)) {
        const arg = path.get('arguments.0');
        setLiteralValue(arg, `node:${value}`);
        
        return;
    }
    
    const {source} = path.node;
    setLiteralValue(source, `node:${value}`);
};

module.exports.traverse = ({push}) => ({
    [IMPORT](path) {
        const {__a} = getTemplateValues(path, IMPORT);
        const {value} = __a;
        
        if (check(value))
            push({
                path,
                value,
            });
    },
    [REQUIRE](path) {
        const {__a} = getTemplateValues(path, REQUIRE);
        const {value} = __a;
        
        if (check(value))
            push({
                path,
                value,
            });
    },
    ImportDeclaration(path) {
        const {value} = path.node.source;
        
        if (check(value))
            push({
                path,
                value,
            });
    },
});

function check(value) {
    if (value.startsWith('node:'))
        return false;
    
    return isBuiltin(value);
}
