'use strict';

import { app, protocol, BrowserWindow, ipcMain, Tray, Menu } from 'electron';

import {
	createProtocol
	/* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
const isDevelopment = process.env.NODE_ENV !== 'production';

// import crawler
import './crawler';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		backgroundColor: '#ddd',
		minWidth: 480,
		width: 540,
		// maxWidth: 720,
		minHeight: 720,
		height: 960,
		///
		x: 30,
		y: 18,
		// frame: false,
		title: 'electron searcher',
		// opacity: 0.5,
		// autoHideMenuBar: true,
		// transparent: true,
		autoHideMenuBar: true,
		frame: false,
		resizable: true,
		show: false,
		webPreferences: {
			nodeIntegration: true
		}
	});

	// win.webContents.op

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol('app');
		// Load the index.html when not in development
		win.loadURL('app://./index.html');
	}

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		win = null;
	});
}

app.on('before-quit', () => {
	tray.destroy();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

let tray = null;
app.on('ready', () => {
	// const iconPath = path.resolve(__dirname, 'trayicon.ico');
	// const trayIcon = nativeImage.createFromPath(iconPath);
	// trayIcon.resize({ width: 16, height: 16 });
	// console.log(iconPath);
	tray = new Tray('build/trayicon.ico');
	// console.log(path.resolve(__dirname, 'build/trayicon.ico'));
	// console.log(path.resolve(__dirname, '/'));
	// console.log(__dirname);
	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Open', type: 'normal', click: () => win.show() },
		{ type: 'separator' },
		{ label: 'Item2', type: 'radio' },
		{ label: 'Item3', type: 'radio', checked: true },
		{ label: 'Close', type: 'normal', click: () => win.close() }
	]);
	tray.setToolTip('This is my application.');
	tray.setContextMenu(contextMenu);

	tray.on('double-click', () => win.show());
	// tray.ball
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
});

ipcMain.on('windowMin', () => {
	win.minimize();
});

ipcMain.on('windowMax', () => {
	win.maximize();
});

ipcMain.on('windowRestore', () => {
	win.restore();
});

ipcMain.on('windowHide', () => {
	win.hide();
});

ipcMain.on('windowWidth', (e, args) => {
	if (win.isMaximized()) win.restore();
	win.setSize(args.width, win.getSize()[1], true);
});

ipcMain.on('windowClose', () => {
	win.close();
});

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
