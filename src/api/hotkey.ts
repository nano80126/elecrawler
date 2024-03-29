import { globalShortcut } from 'electron';
import { win } from '@/background';
import { EplayHotkey, EtrayVolume } from '@/types/enum';
import { ESTALE } from 'constants';

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
				win.webContents.send(EplayHotkey.TOGGLEVIDEO);
			}
		});

		// globalShortcut.register('Alt+F6', () => {
		// 	if (win) {
		// 		win.webContents.send(EplayHotkey.PAUSEVIDEO);
		// 	}
		// });

		globalShortcut.register('Alt+F6', () => {
			if (!win?.isVisible()) {
				win?.show();
			} else {
				win?.hide();
			}
		});

		// globalShortcut.register('Alt+F8', () => {
		// 	win?.hide();
		// });

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
