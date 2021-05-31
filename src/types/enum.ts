/**enumerater of ipcMain.on event for window control */
export enum EwindowOn {
	/**window minimize, on event */
	WINDOWMIN = 'window-min',
	/**window maximize, on event */
	WINDOWMAX = 'window-max',
	/**window restore, on event */
	WINDOWRESTORE = 'window-restore',
	/**window hide, on event */
	WINDOWHIDE = 'window-hide',
	/**window close, on event */
	WINDOWCLOSE = 'window-close',
	/**window change width, on event, need args */
	WINDOWWIDTH = 'window-width',
	/**check if window is maxmized, handle event */
	WINDOWMAXIMIZED = 'window-maximized',
}

/**enumerater of ipcMain.on event for window control */
export enum EpanelOn {
	/**panel show */
	PANELSHOW = 'panel-show',
	/**panel hide */
	PANELHIDE = 'panel-hide',
	/**panel close */
	PANELCLOSe = 'panel-close',
}

/**enumerater of ipcMain.on event for tray control */
export enum EtrayOn {
	/**tray mode event */
	MODE = 'tray-mode',
	/**tray volume event */
	VOLUME = 'tray-volume',
}

/**enumerator of ipcMain.send to main.ts */
export enum EtrayMode {
	/** */
	MODESINGLE = 'mode-single',
	/** */
	MODELOOP = 'mode-loop',
	/** */
	MODESHUFFLE = 'mode-shuffle',
}

/**enumerator of ipcMain.send to main.ts */
export enum EtrayVolume {
	/** */
	VOLUMEPLUS = 'volume-plus',
	/** */
	VOLUMEMINUS = 'volume-minus',
	/** */
	VOLUMESET = 'volume-set',
}
