'use strict';

declare const __static: string;

import { app, protocol, BrowserWindow, ipcMain, Tray, Menu, MenuItem } from 'electron';
import path from 'path';
import qs from 'qs';

import {
	createProtocol
	/* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const isDevelopment = process.env.NODE_ENV !== 'production';

// import crawler
// import './api/fastify';
import './api/express';
import './api/crawler';
import './api/sharp';

import { registerHotkey, unregisterAllHotKey } from './api/shortcut';
import { config, saveConfig } from './api/fs';
import { mongoCLient } from './api/mongo';

// custom types
import { Iconfig, IchannelLyricsObj, EtrayOn, EwindowOn, EmodeSend, EvolumeSend, EpanelOn } from './types/main';
// import './api/mongo';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// let win: BrowserWindow | null = null;
let tray: Tray | null = null;

// windows
let win: BrowserWindow | null = null;
let child: BrowserWindow | null = null;
let childCloseTimer: NodeJS.Timeout | null = null;
//
let locale: string | undefined = process.env.VUE_APP_I18N_LOCALE;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

// const mainMenu = Menu.buildFromTemplate([
// 	{
// 		label: 'File',
// 		type: 'submenu',
// 		submenu: [{ role: 'close' }]
// 	},
// 	{
// 		label: 'Window',
// 		type: 'submenu',
// 		submenu: [{ role: 'toggleDevTools' }]
// 	}
// ]);

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		title: 'EleCrawler',
		backgroundColor: '#212121',
		// backgroundColor: 'transparent',
		minWidth: 480,
		width: 480,
		// maxWidth: 720,
		minHeight: 720,
		height: 960,
		///
		x: (config as Iconfig).x || 30,
		y: (config as Iconfig).y || 40,
		// frame: false,
		// opacity: 0.5,
		// autoHideMenuBar: true,
		// transparent: true,
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

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol('app');
		// Load the index.html when not in development
		// win.loadURL('app://./index.html');
		win.loadURL(`http://localhost:${process.env.VUE_APP_PORT}/`);
	}

	win.once('ready-to-show', () => {
		win?.show();
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

// app.disableHardwareAcceleration();

app.on('ready', () => {
	// trayIcon.resize({ width: 16, height: 16 });
	tray = new Tray(path.resolve(__static, 'icons/trayicon.ico'));
	const contextMenu = Menu.buildFromTemplate([
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
				{ type: 'radio', label: 'Mute', click: () => win?.webContents.send(EvolumeSend.VOLUMESET, { vol: 0 }) },
				{ type: 'radio', label: '25%', click: () => win?.webContents.send(EvolumeSend.VOLUMESET, { vol: 25 }) },
				{ type: 'radio', label: '50%', click: () => win?.webContents.send(EvolumeSend.VOLUMESET, { vol: 50 }) },
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
			click: () => win?.close()
		}
	]);
	tray.setToolTip('EleCrawler');
	tray.setContextMenu(contextMenu);

	tray.on('double-click', () => {
		win?.show();
	});

	ipcMain.on(EtrayOn.MODE, (e, args: { loop: boolean; shuffle: boolean }) => {
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
	});

	ipcMain.on(EtrayOn.VOLUME, (e, args: { volume: number }) => {
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
	});
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
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

app.whenReady().then(() => {
	createWindow();

	registerHotkey();

	// installExtension(VUEJS_DEVTOOLS)
	// 	.then(name => {
	// 		console.log(`Add Extension: ${name}`);
	// 	})
	// 	.catch(err => {
	// 		console.log('An error occurred', err);
	// 	});
});

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

ipcMain.handle(EpanelOn.PANELSHOW, () => {
	if (child) {
		clearTimeout(childCloseTimer as NodeJS.Timeout);
		child.show();
		return true;
	} else return false;
});

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

ipcMain.on('windowClose', () => {
	win?.close();
});

ipcMain.handle('isMaxmized', () => {
	return win?.isMaximized();
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
