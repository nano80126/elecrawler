/* eslint-disable */
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
// const WorkerPlugin = require('worker-plugin');

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
		port: 8080,
	},
	css: {
		extract: { ignoreOrder: true },
	},
	pages: {
		main: {
			entry: 'src/main.ts',
			template: 'public/index.html',
			filename: 'index.html',
			title: 'main',
			chunks: ['chunk-common', 'chunk-main-vendors', 'main'],
		},
		splash: {
			entry: 'src/pages/splash/main.ts',
			template: 'public/splash.html',
			filename: 'splash.html',
			title: 'splash',
			chunks: ['chunk-common', 'chunk-splash-vendors', 'splash'],
		},
		panel: {
			entry: 'src/pages/panel/main.ts',
			template: 'public/splash.html',
			filename: 'panel.html',
			title: 'panel',
			chunks: ['chunk-common', 'chunk-panel-vendors', 'panel'],
		},
	},
	chainWebpack: (config) => {
		// 保留空白
		config.module
			.rule('vue')
			.use('vue-loader')
			.tap((args) => {
				args.compilerOptions.whitespace = 'preserve';
			});

		config.optimization.splitChunks({
			cacheGroups: {
				main: {
					name: 'chunk-main-vendors',
					priority: -10,
					chunks: (chunk) => chunk.name === 'main',
					test: /[\\/]node_modules[\\/]/,
					enforce: true,
				},
				splash: {
					name: 'chunk-splash-vendors',
					priority: -11,
					chunks: (chunk) => chunk.name === 'splash',
					test: /[\\/]node_modules[\\/]/,
					enforce: true,
				},
				panel: {
					name: 'chunk-panel-vendors',
					priority: -12,
					chunks: (chunk) => chunk.name === 'panel',
					test: /[\\/]node_modules[\\/]/,
					enforce: true,
				},
				common: {
					name: 'chunk-common',
					priority: -20,
					chunks: 'initial',
					minChunks: 2,
					reuseExistingChunk: true,
					enforce: true,
				},
			},
		});
	},
	configureWebpack: {
		plugins: [
			new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-tw$/),
			//
			// new WorkerPlugin()
		],
	},
	// configureWebpack: () => {
	// 	return {
	// 		plugins: [new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-tw$/)]
	// 	};
	// },
	pluginOptions: {
		electronBuilder: {
			preload: 'src/preload.ts',
			// {mainPreload: "src/preload.ts",panelPreload: "src/preload2.ts"},

			chainWebpackMainProcess: (config) => {
				// Chain webpack config for electron main process only
				// config.target = 'node';
				const exts = {
					sharp: 'commonjs2 sharp',
					// mongodb: 'commonjs2 mongodb',
					// express: 'express',
				};
				Object.assign(
					exts,
					process.env.NODE_ENV == 'development' ? { mongodb: 'commonjs2 mongodb' } : undefined
					// process.env.NODE_ENV == 'development' ? { express: { commonjs: 'express' } } : undefined,
				);
				// config.externals([
				// 	exts,
				// 	{
				// 		// bufferutil: 'commonjs bufferutil',
				// 		// 'utf-8-validate': 'commonjs utf-8-validate'
				// 	},
				// ]);
				// config.target = 'node';
				// config.externals([
				// 	nodeExternals({
				// 		allowlist: [
				// 			/^vue-cli-plugin-electron-builder/,
				// 			// 'tslib',
				// 			'cheerio',
				// 			'axios',
				// 			'qs',
				// 			/^lodash/,
				// 			// 'moment'
				// 			// 'side-channel',
				// 			// 'get-intrinsic',
				// 			// 'has-symbols',
				// 		],
				// 		modulesFromFile: true,
				// 	}),
				// ]);
				config.target = 'node';
				config.externals([
					exts,
					// {
					// 	// express: { commonjs: 'express' },
					// 	// mongodb: { commonjs2: 'mongodb' },
					// },
				]);
			},
			chainWebpackRendererProcess: (config) => {
				// config.plugin('define').tap(args => {
				// 	args[0]['TEST123'] = true;
				// 	return args;
				// });
			},
			// mainProcessFile: './src/background.ts',
			//
			mainProcessWatch: ['src/api/*.ts'],
			// disableMainProcessTypescript: true, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
			// mainProcessTypeChecking: false, // Manually enable type checking during webpck bundling for background file.
			builderOptions: {
				productName: 'EleCrawler',
				copyright: 'Copyright © 2021',
				// extends: null,
				// directories: {
				// 	// buildResources: ['src/try.js']
				// },
				// asar: false,
				// extraResources: [
				// 	// {
				// 	// 	from: 'src/worker.js',
				// 	// 	to: './app/worker.js'
				// 	// }
				// ],
				win: {
					icon: 'build/icon.png',
					target: [
						{
							target: 'nsis',
							arch: ['x64'],
						},
					],
				},
				nsis: {
					oneClick: false,
					allowElevation: true,
					allowToChangeInstallationDirectory: true,
					createDesktopShortcut: true,
					shortcutName: 'Spider',
				},
			},
		},
		i18n: {
			locale: 'tw',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableInSFC: false,
		},
	},
};
