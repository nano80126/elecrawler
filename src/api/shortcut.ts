import { globalShortcut } from 'electron';
import { win } from '@/background';
import { EtrayVolume } from '@/types/enum';

/** 註冊 global 快捷鍵 */
export function globalRegisterHotkey(): Promise<void> {
	return new Promise((resolve) => {
		globalShortcut.register('Alt+-', () => {
			if (win) {
				win.webContents.send(EtrayVolume.VOLUMEMINUS);
			}
		});

		globalShortcut.register('Alt+=', () => {
			if (win) {
				win.webContents.send(EtrayVolume.VOLUMEPLUS);
			}
		});

		globalShortcut.register('Alt+F5', () => {
			if (win) {
				win.webContents.send('playVideo');
			}
		});

		globalShortcut.register('Alt+F6', () => {
			if (win) {
				win.webContents.send('pauseVideo');
			}
		});

		globalShortcut.register('Alt+F7', () => {
			win?.show();
		});

		globalShortcut.register('Alt+F8', () => {
			win?.hide();
		});

		resolve();
	});
}

/**註冊視窗快捷鍵 */
export function winRegisterHotkey() {
	win?.webContents.on('before-input-event', (e, input) => {
		if (input.alt && input.key.toLocaleLowerCase() == 'f12') {
			win?.webContents.openDevTools();
			e.preventDefault();
		}
	});
}

/** 反註冊 所有快捷鍵 */
export function unregisterAllHotKey() {
	globalShortcut.unregisterAll();
	win?.webContents.removeAllListeners('before-input-event');
}
