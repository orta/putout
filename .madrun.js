'use strict';

const {run, cutEnv} = require('madrun');
const {workspaces} = require('./package');

const cutStar = (a) => a.replace('/*', '');
const dirs = getDirs(workspaces);

const baseEnv = {
    PUTOUT_PROGRESS_BAR: 0,
    FORCE_COLOR: 3,
};

const env = {
    ...baseEnv,
    CI: 1,
    SUPERTAPE_PROGRESS_BAR: 1,
    KEYPRESS: 1,
};

module.exports = {
    'test': () => [env, `tape '${dirs}/*/test/*.js' '${dirs}/*/lib/**/*.spec.js'`],
    'test:fail': async () => await run('test', '-f fail'),
    'test:slow': () => 'FORCE_COLOR=3 lerna run test',
    'coverage:ci': async () => [baseEnv, `nyc ${await cutEnv('test')}`],
    'coverage': async () => [env, `nyc --skip-full ${await cutEnv('test')}`],
    'coverage:slow': () => 'FORCE_COLOR=3 lerna run coverage',
    'lint:slow': () => 'FORCE_COLOR=3 lerna run --no-bail lint',
    'lint:dot': () => 'putout .madrun.js',
    'lint-all': async () => `MADRUN_NAME=1 ${await run('lint:*')}`,
    'lint:frame': async () => await run('lint:ci', '-f codeframe'),
    'lint:fresh': async () => await run('lint', '--fresh'),
    'lint:memory': async () => await run('lint:fresh', '-f memory'),
    'fresh:lint': async () => await run('lint:fresh'),
    'fresh': async () => await run(['lint:memory', 'coverage']),
    'lint': () => `putout .`,
    'lint:mark': () => 'putout **/*.md',
    'memory': async () => await run(['lint:fresh', '-f memory']),
    'fix:lint': async () => await run('lint', '--fix'),
    'fix:lint:fresh': async () => await run('fix:lint', '--fresh'),
    'fix:lint:cache': async () => await run('lint:cache', '--fix'),
    'fix:lint:slow': () => 'lerna run --no-bail fix:lint',
    'bootstrap': () => 'lerna bootstrap',
    'report': () => `nyc report --reporter=text-lcov | coveralls`,
};

function getDirs(workspaces) {
    const dirs = workspaces.map(cutStar);
    return `{${dirs.join(',')}}`;
}
