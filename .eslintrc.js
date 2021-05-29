module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/typescript/recommended',
		'@vue/prettier',
		'@vue/prettier/@typescript-eslint',
	],

	parserOptions: {
		ecmaVersion: 2020,
		// parser: '@typescript-eslint/parser'
	},

	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error', 'info'] }] : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'max-len': ['error', { code: 120, tabWidth: 4, ignoreComments: true }],
		// '@typescript-eslint/explicit-module-boundary-types': 'off',
	},
	// overrides: [
	// 	{
	// 		files: ['*.ts', '*.tsx'],
	// 		rules: {
	// 			'@typescript-eslint/explicit-module-boundary-types': 'error',
	// 		},
	// 	},
	// ],
};
