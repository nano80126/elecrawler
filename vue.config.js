/* eslint-disable */
const webpack = require('webpack');

module.exports = {
	transpileDependencies: ['vuetify'],

	// publicPath: require('path').resolve(__dirname, 'dist'),
	publicPath: './',

	productionSourceMap: false,
	// process.env won't work here
	devServer: {
		// before: () => {
		// 	console.log(process.env.IS_ELECTRON);
		// },
		open: false,
		port: 8080
	},

	// 保留空白
	chainWebpack: config => {
		config.module
			.rule('vue')
			.use('vue-loader')
			.tap(args => {
				args.compilerOptions.whitespace = 'preserve';
			});
	},

	configureWebpack: () => {
		return {
			plugins: [new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-tw$/)]
		};
	},

	pluginOptions: {
		electronBuilder: {
			// externals: ['sharp'],
			chainWebpackMainProcess: config => {
				// Chain webpack config for electron main process only
				config.externals({
					// express: 'express',
					// bufferutil: 'commonjs bufferutil',
					// 'utf-8-validate': 'commonjs utf-8-validate'
					sharp: 'commonjs2 sharp'
				});
			},
			chainWebpackRendererProcess: config => {
				// config.plugin('define').tap(args => {
				// 	args[0]['TEST123'] = true;
				// 	return args;
				// });
			},
			mainProcessWatch: ['src/main/*.ts'],
			// disableMainProcessTypescript: true, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
			// mainProcessTypeChecking: false, // Manually enable type checking during webpck bundling for background file.
			builderOptions: {
				productName: 'lyric spider',
				copyright: 'Copyright © 2020',
				win: {
					icon: 'build/crawler.png',
					target: [
						{
							target: 'nsis',
							arch: ['x64']
						}
					]
				},
				nsis: {
					oneClick: false,
					allowElevation: true,
					allowToChangeInstallationDirectory: true,
					createDesktopShortcut: true,
					shortcutName: 'Spider'
				}
			}
		},
		i18n: {
			locale: 'tw',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableInSFC: false
		}
	}

	// configureWebpack: {
	// 	externals: {
	// 		express: 'express'
	// 	}
	// }
};
