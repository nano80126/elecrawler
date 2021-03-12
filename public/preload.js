/** proload.ts  */
/** if no this file and directly bind the method with vue prototype */
/** may cause some security problems  */

// import { contextBridge, ipcRenderer, shell } from 'electron';
const { contextBridge, ipcRenderer, shell } = window.require('electron');

window.addEventListener('load', () => {
	contextBridge.exposeInMainWorld('ipcRenderer', {
		invoke: (channel, data) => {
			return ipcRenderer.invoke(channel, data);
		},
		send: (channel, data) => {
			ipcRenderer.send(channel, data);
		},
		on: (channel, listener) => {
			ipcRenderer.on(channel, (e, args) => listener(e, args));
		},
		once: (channel, listener) => {
			ipcRenderer.once(channel, (e, args) => listener(e, args));
		},
		removeAllListeners: channel => {
			ipcRenderer.removeAllListeners(channel);
		}
	});

	contextBridge.exposeInMainWorld('shell', {
		openPath: path => {
			shell.openPath(path);
		},
		openExternal: url => {
			shell.openExternal(url);
		}
	});
});
