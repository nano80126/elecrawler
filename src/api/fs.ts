import fs from 'fs';
import path from 'path';
import { app, ipcMain } from 'electron';
import { Iconfig } from '@/types';
import { EfsOn } from '@/types/enum';

const picPath = path.resolve(app.getPath('pictures'), 'EleCrawler');
// process.env.NODE_ENV == 'development'
// 	? path.resolve(app.getPath('pictures'), 'EleCrawler')
// 	: path.resolve(app.getPath('exe'), '../pictures');

const jsonPath = path.resolve(app.getPath('userData'), 'config.json');

/**use this after calling loadConfig() */
let config: Iconfig | {} = {};

/**初始化 file 操作channel */
export function registerFileOperation(): Promise<void> {
	return new Promise((resolve) => {
		// create picture directory
		ipcMain.handle(EfsOn.MAKEDIR, () => {
			const exist = fs.existsSync(picPath);
			if (!exist) {
				fs.mkdir(picPath, (err) => {
					if (err) console.log(err);
				});
			}
			return { path: picPath };
		});

		ipcMain.handle(EfsOn.GETDIR, () => {
			const exist = fs.existsSync(picPath);
			if (!exist) throw new Error('No image directory exists.');
			return { path: picPath };
		});

		// 清空資料夾，但不刪除資料夾本身
		ipcMain.handle(EfsOn.EMPTYDIR, () => {
			// const { dirPath } = args;
			const files = fs.readdirSync(picPath);

			files.forEach((file: string) => {
				const f = path.resolve(picPath, file);
				fs.unlinkSync(f);
			});
			return { n: files.length };
		});

		// 刪除檔案(array)
		ipcMain.on(EfsOn.REMOVEPIC, (e, args: { files: string[] }) => {
			const { files } = args;

			files.forEach((file: string) => {
				const f = path.resolve(picPath, file);

				if (fs.existsSync(f)) {
					fs.unlinkSync(f);
				}
			});
		});

		ipcMain.handle(EfsOn.READCONFIG, () => {
			return config;
		});

		ipcMain.handle(EfsOn.WRITECONFIG, (e, args) => {
			return Object.assign(config, args);
		});

		resolve();
	});
}

/**載入 config */
export function loadConfig() {
	return new Promise((resolve) => {
		const exist = fs.existsSync(jsonPath);
		if (!exist) {
			fs.writeFileSync(jsonPath, JSON.stringify({}));
			config = {};
		} else {
			const cfg = JSON.parse(fs.readFileSync(jsonPath).toString());
			config = cfg;
		}

		resolve('load config successfully');
	});
}

/**儲存 config */
export function saveConfig(args = {}): void {
	Object.assign(config, args);

	// 排序 config
	const newCfg: { [key: string]: string | number } = {};
	Object.keys(config)
		.sort((a, b) => a.length - b.length)
		.forEach((key) => {
			newCfg[key] = (config as { [key: string]: string })[key];
		});
	// 儲存 config
	fs.writeFile(jsonPath, JSON.stringify(newCfg), (err) => {
		//
		if (err) console.log(err);
	});
}

export { config, picPath };
