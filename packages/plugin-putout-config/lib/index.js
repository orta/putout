'use strict';

const applyLabels = require('./apply-labels');
const applyNodejs = require('./apply-nodejs');
const applyTape = require('./apply-tape');
const convertBooleanToString = require('./convert-boolean-to-string');
const removeEmpty = require('./remove-empty');
const MoveFormatterUp = require('./move-formatter-up');

module.exports.rules = {
    'apply-labels': applyLabels,
    'apply-nodejs': applyNodejs,
    'apply-tape': applyTape,
    'convert-boolean-to-string': convertBooleanToString,
    'move-formatter-up': MoveFormatterUp,
    'remove-empty': removeEmpty,
};
