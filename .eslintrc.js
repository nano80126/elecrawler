module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? ['off', { allow: ['warn', 'error'] }] : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-var': 'error',
		'prefer-const': 'error',
		'max-len': ['error', { code: 120, tabWidth: 4 }],
		camelcase: 'error'
	}
};
