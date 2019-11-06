'use strict';

const test = require('supertape');
const {template, parse} = require('@putout/engine-parser');

const {
    compare,
    compareAll,
    compareAny,
} = require('..');

test('compare: base is string', (t) => {
    const a = template.ast('const a = "hello"');
    const b = template.ast('const a = "__"');
    
    const result = compare(a, b);
    
    t.ok(result, 'should equal');
    t.end();
});

test('compare: false property', (t) => {
    const result = compare('async () => {}', '() => {}');
    
    t.notOk(result, 'should not equal');
    t.end();
});

test('compare: identifier', (t) => {
    const result = compare('hello', '__');
    
    t.ok(result, 'should equal');
    t.end();
});

test('compare: string literal: raw', (t) => {
    const ast1 = parse(`'madrun'`);
    const ast2 = parse(`"madrun"`);
    
    const result = compare(ast1, ast2);
    
    t.ok(result, 'should equal');
    t.end();
});

test('compare: literal', (t) => {
    const result = compare('"hi"', '"__"');
    
    t.ok(result, 'should equal');
    t.end();
});

test('compare: base is string: path', (t) => {
    const node = template.ast('const a = "hello"');
    const b = template.ast('const a = "__"');
    
    const result = compare({node}, b);
    
    t.ok(result, 'should equal');
    t.end();
});

test('compare: base is string: no', (t) => {
    const a = template.ast('const a = 5');
    const b = template.ast('const a = "__"');
    
    const result = compare(a, b);
    
    t.notOk(result, 'should equal');
    t.end();
});

test('compare: base is any', (t) => {
    const a = template.ast('const a = {}');
    const b = template.ast('const a = __');
    
    const result = compare(a, b);
    
    t.ok(result, 'should equal');
    t.end();
});

test('compare: strings', (t) => {
    const result = compare('const a = {}', 'if (2 > 3)__');
    
    t.notOk(result, 'should equal');
    t.end();
});

test('compare: all: base is all', (t) => {
    const result = compareAll('const a = {}', [
        'const a  = __',
    ]);
    
    t.ok(result, 'should equal');
    t.end();
});

test('compare: all: base is all: no', (t) => {
    const result = compareAll('const a = {}', [
        'const a = " "',
        'const a  = "__"',
        'const a  = __',
    ]);
    
    t.notOk(result, 'should equal');
    t.end();
});

test('compare: any: base is any', (t) => {
    const result = compareAny('const a = {}', [
        'const a = " "',
        'const a  = "__"',
        'const a  = __',
    ]);
    
    t.ok(result, 'should equal');
    t.end();
});

test('compare: any: base is any: no', (t) => {
    const result = compareAny('const a = {}', [
        'const a = " "',
        'const a  = "__"',
    ]);
    
    t.notOk(result, 'should equal');
    t.end();
});

test('compare: template var', (t) => {
    const a = template.ast('const hello = "hello"');
    const b = template.ast('const __a = "__"');
    
    const result = compare(a, b);
    
    t.ok(result, 'should equal');
    t.end();
});

test('compare: __object', (t) => {
    const a = template.ast('const {} = d');
    const b = template.ast('const __object = __');
    
    const result = compare(a, b);
    
    t.ok(result);
    t.end();
});

test('compare: __object: array pattern', (t) => {
    const a = template.ast('const [] = d');
    const b = template.ast('const __object = __');
    
    const result = compare(a, b);
    
    t.notOk(result);
    t.end();
});

test('compare: __object: not equal', (t) => {
    const a = template.ast('const {a} = d');
    const b = template.ast('const __object = __');
    
    const result = compare(a, b);
    
    t.ok(result);
    t.end();
});

test('compare: __object: object expression', (t) => {
    const a = template.ast('const {a} = {}');
    const b = template.ast('const __ = __object');
    
    const result = compare(a, b);
    
    t.ok(result);
    t.end();
});

test('compare: __object: object expression: not equal', (t) => {
    const a = template.ast('const {a} = {a}');
    const b = template.ast('const __ = __object');
    
    const result = compare(a, b);
    
    t.ok(result);
    t.end();
});

test('compare: __array: array pattern', (t) => {
    const a = template.ast('const [] = d');
    const b = template.ast('const __array = __');
    
    const result = compare(a, b);
    
    t.ok(result);
    t.end();
});

test('compare: __array: object pattern', (t) => {
    const a = template.ast('const {} = d');
    const b = template.ast('const __array = __');
    
    const result = compare(a, b);
    
    t.notOk(result);
    t.end();
});

test('compare: __array: array pattern: not empty', (t) => {
    const a = template.ast('const [a] = d');
    const b = template.ast('const __array = __');
    
    const result = compare(a, b);
    
    t.ok(result);
    t.end();
});

test('compare: __array: array expression', (t) => {
    const a = template.ast('const [a] = []');
    const b = template.ast('const __ = __array');
    
    const result = compare(a, b);
    
    t.ok(result);
    t.end();
});

test('compare: __array: array expression: equal', (t) => {
    const a = template.ast('const a = [b]');
    const b = template.ast('const __ = __array');
    
    const result = compare(a, b);
    
    t.ok(result);
    t.end();
});

test('compare: array: strict', (t) => {
    const a = template.ast('const a = [b]');
    const b = template.ast('const __ = []');
    
    const result = compare(a, b);
    
    t.notOk(result);
    t.end();
});

test('compare: array: strict: same', (t) => {
    const a = template.ast('const a = [b]');
    const b = template.ast('const __ = [__a]');
    
    const result = compare(a, b);
    
    t.ok(result);
    t.end();
});

test('compare: object: strict', (t) => {
    const a = template.ast('const {hello} = y');
    const b = template.ast('const {} = m');
    
    const result = compare(a, b);
    
    t.notOk(result);
    t.end();
});

test('compare: object: strict: same', (t) => {
    const a = template.ast('const {hello} = y');
    const b = template.ast('const {__a} = m');
    
    const result = compare(a, b);
    
    t.notOk(result);
    t.end();
});

test('compare: __args', (t) => {
    const a = template.ast('(a, b) => {}');
    const b = template.ast('(__args) => __');
    
    const result = compare(a, b);
    
    t.ok(result);
    t.end();
});

test('compare: __object: top level', (t) => {
    const result = compare('obj = {x: 0}', '__ = __object');
    
    t.ok(result);
    t.end();
});

test('compare: class body', (t) => {
    const node = 'class Button extends Component {render(){}}';
    const nodeTmpl = 'class __ extends Component {}';
    const result = compare(node, nodeTmpl);
    
    t.ok(result);
    t.end();
});

test('compare: function block', (t) => {
    const node = '() => {alert()}';
    const nodeTmpl = '() => {}';
    const result = compare(node, nodeTmpl);
    
    t.ok(result);
    t.end();
});

