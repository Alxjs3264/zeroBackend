module.exports = {
  env: {
    node     : true,
    commonjs : true,
    es6      : true
  },
  extends       : 'standard',
  parserOptions : {
    ecmaVersion : 2020,
    sourceType  : 'module'
  },
  ignorePatterns : ['**/src/infrastructure/seeders/*.*'],
  rules          : {
    'arrow-body-style'      : [0, 'as-needed'],
    'max-len'               : ['error', { code: 250, ignoreStrings: true }],
    'no-use-before-define'  : ['error', { functions: false, classes: true }],
    'no-prototype-builtins' : 0,
    'no-underscore-dangle'  : 0,
    'no-multi-spaces'       : 'off',
    'no-unused-vars'        : ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    semi                    : [2, 'always'],
    'no-labels'             : ['error', { allowLoop: true }],
    'key-spacing'           : ['error', {
      // align : 'value',
      // align : 'colon',
      align: { beforeColon: true, afterColon: true, on: 'colon' }
    }]
  },
  globals: {
    describe   : true,
    expect     : true,
    it         : true,
    before     : true,
    after      : true,
    beforeEach : true,
    afterEach  : true
  }
};
