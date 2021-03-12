/** proload.ts  */
/** if no this file and directly bind the method with vue prototype */
/** may cause some security problems  */

import { contextBridge, ipcRenderer, shell } from 'electron';

// window.addEventListener('load', () => {
contextBridge.exposeInMainWorld('ipcRenderer', {
	invoke: (channel: string, data: unknown) => {
		return ipcRenderer.invoke(channel, data);
	},
	send: (channel: string, data: unknown) => {
		ipcRenderer.send(channel, data);
	},
	on: (channel: string, listener: Function) => {
		ipcRenderer.on(channel, (e, args) => listener(e, args));
	},
	once: (channel: string, listener: Function) => {
		ipcRenderer.once(channel, (e, args) => listener(e, args));
	},
	removeAllListeners: (channel: string) => {
		ipcRenderer.removeAllListeners(channel);
	}
});

contextBridge.exposeInMainWorld('shell', {
	openPath: (path: string) => {
		shell.openPath(path);
	},
	openExternal: (url: string) => {
		shell.openExternal(url);
	}
});
// });
