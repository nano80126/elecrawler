/* eslint-disable */
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

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
			chainWebpackMainProcess: config => {
				// Chain webpack config for electron main process only
				config.target = 'node';
				config.externals([
					{
						// bufferutil: 'commonjs bufferutil',
						// 'utf-8-validate': 'commonjs utf-8-validate'
						// mongodb: 'commonjs mongodb',
						sharp: 'commonjs2 sharp'
					}
					// nodeExternals({ allowlist: ['vue-cli-plugin-electron-builder/lib'] })
					// nodeExternals({
					// 	modulesFromFile: {
					// 		include: ['vue-cli-plugin-electron-builder/lib'],
					// 		exclude: ['commonjs mongodb', 'commonjs2 sharp']
					// 	}
					// })
				]);
			},
			chainWebpackRendererProcess: config => {
				// config.plugin('define').tap(args => {
				// 	args[0]['TEST123'] = true;
				// 	return args;
				// });
			},
			// mainProcessFile: './src/background.ts',
			//
			mainProcessWatch: ['src/main/*.ts'],
			// disableMainProcessTypescript: true, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
			// mainProcessTypeChecking: false, // Manually enable type checking during webpck bundling for background file.
			builderOptions: {
				productName: 'EleCrawler',
				copyright: 'Copyright © 2020',
				// extends: null,
				// files: [
				// 	{
				// 		from: 'build',
				// 		filter: '**/*.js'
				// 	}
				// ],
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
};
