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
	/**change play mode to single */
	MODESINGLE = 'mode-single',
	/**change play mode to loop */
	MODELOOP = 'mode-loop',
	/**change play mode to order */
	MODEORDER = 'mode-order',
	/**change play mode to shuffle */
	MODESHUFFLE = 'mode-shuffle',
}

/**enumerator of ipcMain.send to main.ts */
export enum EtrayVolume {
	/**volume plus */
	VOLUMEPLUS = 'volume-plus',
	/**volume minus */
	VOLUMEMINUS = 'volume-minus',
	/**set volume value */
	VOLUMESET = 'volume-set',
}

/**enumerator for crawler on event */
export enum EcrawlerOn {
	/**get list searched */
	LIST = 'crawl-list',
	/**get lyrics */
	LYRICS = 'crawl-lyrics',
}

/**enumerator for fs on event */
export enum EfsOn {
	/**make picture directory */
	MAKEDIR = 'make-picture-directory',
	/**get picture directory */
	GETDIR = 'get-picture-directory',
	/**empty picture directory */
	EMPTYDIR = 'empty-picture-directory',
	/**remove specific picture  */
	REMOVEPIC = 'remove-picture',
	/**read configuration */
	READCONFIG = 'read-config',
	/**write configuration */
	WRITECONFIG = 'write-config',
}

/**enumerator for play evnet */
export enum EplayHotkey {
	/**play video */
	PLAYVIDEO = 'play-video',
	/**pause video */
	PAUSEVIDEO = 'pause-video',
}

/**mongo handle or on */
export enum EmongoOn {
	/**find data in history collection */
	HISTORYFIND = 'history-find',
	/**save data in history collection */
	HISTORYSAVE = 'history-save',
	/**find some in list collection */
	LISTFIND = 'list-find',
	/**find one in list collection */
	LISTFINDONE = 'list-find-one',
	/**save data in list collection (unique, upsert) */
	LISTSAVE = 'list-save',
	/**remove some in list collection */
	LISTREMOVE = 'list-remove',
	/**remove one in list collection */
	LISTREMOVEONE = 'list-remove-one',
}

export enum EsharpOn {
	/**Load image buffer */
	LOADIMAGEBYPATH = 'load-image-by-path',
	/**Load */
	LOADIMAGEBYDIALOG = 'load-image-by-dialog',
	/**Get YouTube Video background image */
	GETVIDEOIMAGE = 'get-video-image',
	/**Convert path top buffer */
	TOBUFFER = 'to-buffer',
	/**Change buffer to image and save */
	SAVEIMAGE = 'save-image',
}
