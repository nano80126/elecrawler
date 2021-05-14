'use strict';

declare const __static: string;

import { app, protocol, BrowserWindow, ipcMain, Tray, Menu, MenuItem } from 'electron';
// import { Worker, isMainThread } from 'worker_threads';
// import { execFile, fork, spawn } from 'child_process';
import path from 'path';
import qs from 'qs';

import {
	createProtocol
	/* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const isDevelopment = process.env.NODE_ENV !== 'production';

// const worker = new Worker(path.join(__dirname, './api/express.js'), { workerData: null });
// const workerPath = path.join(__dirname, 'worker.js');
// const worker = new Worker(workerPath, {
// 	workerData: {
// 		path: './api/express.ts'
// 	}
// });
// worker.addListener('message', msg => {
// 	console.log(msg);
// });

// import crawler
// import './api/fastify';
/******************************************************************************************************* */
import { initializeExpress } from './api/express';
import { crawlerRegister } from './api/crawler';
import { registerSharpHandler } from './api/sharp';

import { globalRegisterHotkey, winRegisterHotkey, unregisterAllHotKey } from './api/shortcut';
import { registerFileOperation, config, loadConfig, saveConfig } from './api/fs';
import { createMongoConnection, mongoCLient } from './api/mongo';
/******************************************************************************************************* */

// custom types
import { Iconfig, IchannelLyricsObj, EtrayOn, EwindowOn, EmodeSend, EvolumeSend, EpanelOn } from './types/main';
import { exit } from 'process';
// import './api/mongo';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// let win: BrowserWindow | null = null;

// windows
let splash: BrowserWindow | null = null;
let win: BrowserWindow | null = null;
let child: BrowserWindow | null = null;
let childCloseTimer: NodeJS.Timeout | null = null;
//
let locale: string | undefined = process.env.VUE_APP_I18N_LOCALE;
//
let tray: Tray | null = null;
let contextMenu: Menu | null = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

/**Create Tray and Menu */
function createTrayMenu(): Promise<string> {
	return new Promise(resolve => {
		tray = new Tray(path.resolve(__static, 'icons/trayicon.ico'));
		contextMenu = Menu.buildFromTemplate([
			{
				label: 'Open',
				type: 'normal',
				click: () => win?.show()
			},
			{ type: 'separator' },
			{
				type: 'submenu',
				label: 'Mode',
				submenu: [
					{
						type: 'radio',
						label: 'Single',
						checked: true,
						click: () => win?.webContents.send(EmodeSend.MODESINGLE)
					},
					{ type: 'radio', label: 'Loop', click: () => win?.webContents.send(EmodeSend.MODELOOP) },
					{ type: 'radio', label: 'Shuffle', click: () => win?.webContents.send(EmodeSend.MODESHUFFLE) }
				]
			},
			{
				type: 'submenu',
				label: 'Volumn',
				submenu: [
					{
						type: 'radio',
						label: 'Mute',
						click: () => win?.webContents.send(EvolumeSend.VOLUMESET, { vol: 0 })
					},
					{
						type: 'radio',
						label: '25%',
						click: () => win?.webContents.send(EvolumeSend.VOLUMESET, { vol: 25 })
					},
					{
						type: 'radio',
						label: '50%',
						click: () => win?.webContents.send(EvolumeSend.VOLUMESET, { vol: 50 })
					},
					{
						checked: true,
						type: 'radio',
						label: '75%',
						click: () => win?.webContents.send(EvolumeSend.VOLUMESET, { vol: 75 })
					},
					{
						type: 'radio',
						label: '100%',
						click: () => win?.webContents.send(EvolumeSend.VOLUMESET, { vol: 100 })
					},
					{ type: 'radio', label: 'Custom', enabled: false }
				]
			},
			{ type: 'separator' },
			{
				label: 'Close',
				type: 'normal',
				click: () => {
					win?.close();
					splash?.close();
				}
			}
		]);
		tray.setToolTip('EleCrawler');
		tray.setContextMenu(contextMenu);

		tray.on('double-click', () => {
			win?.show();
		});

		resolve('create tray menu successfully');
	});
}

/**Create main screen */
function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		title: 'EleCrawler',
		backgroundColor: '#212121',
		minWidth: 480,
		width: 480,
		minHeight: 720,
		height: 960,
		///
		x: (config as Iconfig).x || 30,
		y: (config as Iconfig).y || 40,
		// frame: false,
		autoHideMenuBar: true,
		frame: false,
		resizable: true,
		show: false,
		webPreferences: {
			preload: path.resolve(__dirname, 'preload.js'),
			nodeIntegration: false,
			enableRemoteModule: false,
			contextIsolation: true,
			nativeWindowOpen: true
		}
	});
	if (process.env.NODE_ENV == 'production') win.removeMenu();
	// win.setMenu(mainMenu);
	// Menu.setApplicationMenu(mainMenu);
	win.webContents.setWindowOpenHandler(handler => {
		const { frameName, features } = handler;

		if (frameName === 'editPanel') {
			const { artist, title, lyricsKey, lyricsUrl } = (qs.parse(features, {
				delimiter: ','
			}) as unknown) as IchannelLyricsObj;

			win?.webContents.on('did-create-window', subWindow => {
				child = subWindow;
				subWindow.once('ready-to-show', () => {
					subWindow.show();
					subWindow.webContents.send('lyricObj', {
						artist: artist,
						song: title,
						key: lyricsKey,
						url: lyricsUrl,
						delay: 0
					});
					subWindow.webContents.send('syncLanguage', locale);
				});

				subWindow.on('closed', () => {
					child = null;
				});
			});

			return {
				action: 'allow',
				overrideBrowserWindowOptions: {
					title: 'Panel',
					backgroundColor: '#212121',
					///
					x: undefined,
					y: undefined,
					width: 640,
					height: 840,
					///
					parent: win as BrowserWindow,
					center: true,
					modal: true,
					show: false,
					autoHideMenuBar: true,
					frame: false,
					resizable: false
				}
			};
		} else {
			return { action: 'deny' };
		}
	});

	//#region 暫時保留
	/** 保留 保留 保留 保留 待刪 待刪 待刪 待刪 */
	// win.webContents.on('new-window', (event, url, frameName, disposition, options) => {
	// 	event.preventDefault();

	// 	if (frameName === 'editPanel') {
	// 		const { artist, title, lyricsKey, lyricsUrl } = options as IchannelLyricsObj;

	// 		if (!child) {
	// 			child = new BrowserWindow({
	// 				title: 'Panel',
	// 				backgroundColor: '#212121',
	// 				///
	// 				width: 640,
	// 				height: 840,
	// 				///
	// 				parent: win as BrowserWindow,
	// 				center: true,
	// 				modal: true,
	// 				show: false,
	// 				autoHideMenuBar: true,
	// 				frame: false,
	// 				resizable: false,
	// 				webPreferences: {
	// 					preload: path.resolve(__dirname, 'preload.js'),
	// 					nodeIntegration: false,
	// 					enableRemoteModule: false,
	// 					contextIsolation: true
	// 				}
	// 			});
	// 			if (process.env.NODE_ENV == 'production') child.removeMenu(); // 移除 menu
	// 			child.loadURL(url);

	// 			// if (process.env.WEBPACK_DEV_SERVER_URL) {
	// 			// 	child.loadURL(url.replace(/(#\/)/, ''));
	// 			// } else {
	// 			// 	child.loadURL('http://localhost:4000' + url);
	// 			// }
	// 		} else {
	// 			child.webContents.send('lyricObj', {
	// 				artist: artist,
	// 				song: title,
	// 				key: lyricsKey,
	// 				url: lyricsUrl,
	// 				delay: 500
	// 			});
	// 			/**同步語言 */
	// 			child.webContents.send('syncLanguage', locale);
	// 			if (!child.isVisible()) child.show();
	// 			if (childCloseTimer) clearTimeout(childCloseTimer);
	// 		}

	// 		child.on('ready-to-show', () => {
	// 			child?.webContents.send('lyricObj', {
	// 				artist: artist,
	// 				song: title,
	// 				key: lyricsKey,
	// 				url: lyricsUrl,
	// 				delay: 0
	// 			});
	// 			/**同步語言 */
	// 			child?.webContents.send('syncLanguage', locale);
	// 			child?.show();
	// 			/**重置timer */
	// 			if (childCloseTimer) clearTimeout(childCloseTimer);
	// 		});

	// 		child.on('close', () => {
	// 			child = null;
	// 		});
	// 	}
	// });
	//#endregion

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol('app');
		// Load the index.html when not in development
		win.loadURL('app://./index.html');
		// win.loadURL(`http://localhost:${process.env.VUE_APP_PORT}/`);
	}

	win.once('ready-to-show', () => {
		win?.show();
	});

	win.once('show', () => {
		splash?.close();
		winRegisterHotkey();
	});

	win.on('close', () => {
		/**關閉前紀錄現在視窗位置 */
		const bound = win?.getBounds();
		saveConfig({ x: bound?.x, y: bound?.y });
	});

	win.on('closed', () => {
		win = null;
	});
}

/**Create splash screen */
function createSplash() {
	// console.log('create splash', new Date() - d);
	// Create the splash window
	splash = new BrowserWindow({
		// backgroundColor: '#212121',
		width: 480,
		height: 350,
		center: true,
		resizable: false,
		show: false,
		transparent: true,
		autoHideMenuBar: true,
		frame: false,
		skipTaskbar: true,
		webPreferences: {
			preload: path.resolve(__dirname, 'preload.js'),
			nodeIntegration: false,
			enableRemoteModule: false,
			contextIsolation: true,
			nativeWindowOpen: true
		}
	});

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		splash.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/splash.html`);
		// if (!process.env.IS_TEST) splash.webContents.openDevTools();
	} else {
		createProtocol('app');
		// Load the index.html when not in development
		splash.loadURL('app://./splash.html');
		// splash.loadURL(`http://localhost:${process.env.VUE_APP_PORT}/splash`);
	}

	splash.once('ready-to-show', async () => {
		// splash?.webContents.send('InitializingMsg', await createTrayMenu());
		if (splash) {
			splash.show();

			splash.webContents.send('InitializingMsg', { msg: await createTrayMenu() });
			splash.webContents.send('InitializingMsg', { msg: await globalRegisterHotkey() });
			splash.webContents.send('InitializingMsg', { msg: await registerFileOperation() });
			splash.webContents.send('InitializingMsg', { msg: await loadConfig() });
			splash.webContents.send('InitializingMsg', { msg: await initializeExpress() });
			splash.webContents.send('InitializingMsg', { msg: await crawlerRegister() });
			splash.webContents.send('InitializingMsg', { msg: await registerSharpHandler() });
			splash.webContents.send('InitializingMsg', { msg: await createMongoConnection() });

			createWindow();
		} else {
			exit(0);
		}
	});

	splash.on('closed', () => {
		splash = null;
	});
}

app.on('ready', () => {
	// createTrayMenu();
	// loadConfig();
});

app.whenReady().then(() => {
	createSplash();
	// createWindow();

	// hotkeyRegister();

	// installExtension(VUEJS_DEVTOOLS)
	// 	.then(name => {
	// 		console.log(`Add Extension: ${name}`);
	// 	})
	// 	.catch(err => {
	// 		console.log('An error occurred', err);
	// 	});
});

// app.disableHardwareAcceleration();

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (splash === null) createSplash();
	// if (win === null) createWindow();
});

app.on('before-quit', () => {
	if (tray) tray.destroy();
	if (mongoCLient) mongoCLient.close();
	unregisterAllHotKey();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', async () => {
// 	if (isDevelopment && !process.env.IS_TEST) {
// 		// Install Vue Devtools
// 		// Devtools extensions are broken in Electron 6.0.0 and greater
// 		// See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
// 		// Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
// 		// If you are not using Windows 10 dark mode, you may uncomment these lines
// 		// In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
// 		// try {
// 		//   await installVueDevtools()
// 		// } catch (e) {
// 		//   console.error('Vue Devtools failed to install:', e.toString())
// 		// }
// 	}
// 	createWindow();
// });

// // // // // // // // // // // // // // // // // // //
ipcMain.on(EwindowOn.WINDOWMIN, () => {
	win?.minimize();
});

ipcMain.on(EwindowOn.WINDOWMAX, () => {
	win?.maximize();
});

ipcMain.on(EwindowOn.WINDOWRESTORE, () => {
	win?.restore();
});

ipcMain.on(EwindowOn.WINDOWHIDE, () => {
	win?.hide();
});

ipcMain.on(EwindowOn.WINDOWCLOSE, () => {
	win?.close();
});
//

ipcMain.handle(EpanelOn.PANELSHOW, () => {
	if (child) {
		clearTimeout(childCloseTimer as NodeJS.Timeout);
		child.show();
		return true;
	} else return false;
});

/**隱藏panel，且3分鐘關閉 */
ipcMain.on(EpanelOn.PANELHIDE, () => {
	child?.hide();

	// 10 分鐘後關閉 child
	childCloseTimer = setTimeout(() => {
		child?.close();
		// child = null;
	}, 1000 * 60 * 3);
});

ipcMain.on('windowWidth', (e, args) => {
	if (win?.isMaximized()) win?.restore();
	win?.setSize(args.width, win?.getSize()[1], true);
});

ipcMain.handle('isMaxmized', () => {
	return win?.isMaximized();
});
// // // // // // // // // // // // // // // // // // //

// // // // // // // // // // // // // // // // // // //
ipcMain.on(EtrayOn.MODE, (e, args: { loop: boolean; shuffle: boolean }) => {
	if (contextMenu) {
		const { loop, shuffle } = args;
		// first items means mode, second items means mode selections
		if (loop) {
			(contextMenu.items[2].submenu?.items[1] as MenuItem).checked = true;
		} else if (shuffle) {
			(contextMenu.items[2].submenu?.items[2] as MenuItem).checked = true;
		} else {
			(contextMenu.items[2].submenu?.items[0] as MenuItem).checked = true;
		}
		tray?.setContextMenu(contextMenu);
	}
});

ipcMain.on(EtrayOn.VOLUME, (e, args: { volume: number }) => {
	if (contextMenu) {
		const { volume } = args;
		// first items means volume, second items means volume selections
		switch (volume) {
			case 0:
				(contextMenu.items[3].submenu?.items[0] as MenuItem).checked = true;
				break;
			case 25:
				(contextMenu.items[3].submenu?.items[1] as MenuItem).checked = true;
				break;
			case 50:
				(contextMenu.items[3].submenu?.items[2] as MenuItem).checked = true;
				break;
			case 75:
				(contextMenu.items[3].submenu?.items[3] as MenuItem).checked = true;
				break;
			case 100:
				(contextMenu.items[3].submenu?.items[4] as MenuItem).checked = true;
				break;
			default:
				(contextMenu.items[3].submenu?.items[5] as MenuItem).checked = true;
				break;
		}
		tray?.setContextMenu(contextMenu);
	}
});
// // // // // // // // // // // // // // // // // // //

/**同步語言 */
ipcMain.on('syncLanguage', (e, args) => {
	locale = args.locale;
	child?.webContents.send('syncLanguage', locale);
});

// // // // // // // // // // // // // // // // // // //

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', data => {
			if (data === 'graceful-exit') {
				app.quit();
			}
		});
	} else {
		process.on('SIGTERM', () => {
			app.quit();
		});
	}
}

export { win, child, tray };
