import { globalShortcut } from 'electron';
import { win } from '@/background';

/** 註冊 global 快捷 */
export function registerHotkey() {
	globalShortcut.register('Alt+F2', () => {
		if (win) {
			win.webContents.send('playVideo');
		}
	});

	globalShortcut.register('Alt+F3', () => {
		if (win) {
			win.webContents.send('pauseVideo');
		}
	});

	globalShortcut.register('Alt+-', () => {
		if (win) {
			win.webContents.send('volumeMinus');
		}
	});

	globalShortcut.register('Alt+=', () => {
		if (win) {
			win.webContents.send('volumePlus');
		}
	});

	globalShortcut.register('Alt+F7', () => {
		win?.show();
	});

	globalShortcut.register('Alt+F8', () => {
		win?.hide();
	});
}

/** */
export function unregisterAllHotKey() {
	globalShortcut.unregisterAll();
}
