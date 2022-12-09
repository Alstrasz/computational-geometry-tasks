module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        'google',
        '@vue/typescript/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'camelcase': 'off',
        '@typescript-eslint/camelcase': 'off',
        'indent': ['error', 4],
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'always',
            asyncArrow: 'always',
        }],
        'space-in-parens': ['error', 'always'],
        'max-len': ['error', { code: 200 }],
        'object-curly-spacing': ['error', 'always'],
        'new-cap': 0,
        'no-unused-vars': 'off',
        'no-throw-literal': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        'require-jsdoc': ['error', {
            require: {
                FunctionDeclaration: false,
                MethodDefinition: false,
                ClassDeclaration: false,
                ArrowFunctionExpression: false,
                FunctionExpression: false,
            },
        }],
        'linebreak-style': 'off',
        'vue/html-indent': ['error', 4, {
            'attribute': 1,
            'baseIndent': 1,
            'closeBracket': 0,
            'alignAttributesVertically': true,
            'ignores': [],
        }],
    },
};
