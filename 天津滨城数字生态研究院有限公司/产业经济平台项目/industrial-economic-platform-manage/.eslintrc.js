module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:vue/essential', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'import/extensions': [2, 'never', {
      'web.js': 'never',
      json: 'never',
      vue: 'always',
      js: 'always'
    }],
    'import/no-unresolved': [2, {
      ignore: ['^@/'] // @ 是设置的路径别名
    }],
    // 'comma-dangle': ['error', {
    //   arrays: 'never',
    //   objects: 'never',
    //   imports: 'never',
    //   exports: 'never',
    //   functions: 'never'
    // }],
    'comma-dangle': 'off',
    'import/no-absolute-path': 'off',
    'no-unused-vars': 'off',
    'no-console': 1,
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'e', // for e.returnvalue
          'ctx', // for Koa routing
          'req', // for Express requests
          'request', // for Express requests
          'res', // for Express responses
          'response', // for Express responses
          'state', // for vuex state
          'error',
          'config',
          'options'
        ]
      }
    ],
    'import/prefer-default-export': 'off',
    'max-len': ['error', { code: 300 }],
    'linebreak-style': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 0,
    'vue/no-v-text-v-html-on-component': 'off',
    'import/no-extraneous-dependencies': 'off',
  }
};
