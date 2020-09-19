import fs from 'fs';
import path from 'path';
import { app, ipcMain } from 'electron';

const picPath =
	process.env.NODE_ENV == 'development'
		? path.resolve(app.getPath('pictures'), 'EleCrawler')
		: path.resolve(app.getPath('exe'), '../pictures');

console.log(picPath);

// create picture directory
ipcMain.handle('mkPicDir', () => {
	const exist = fs.existsSync(picPath);
	if (!exist) {
		fs.mkdir(picPath, err => {
			if (err) console.log(err);
		});
	}
	return { path: picPath };
});

// 清空資料夾，但不刪除資料夾本身
ipcMain.on('emptyDir', (e, args: { dirPath: string }) => {
	const { dirPath } = args;
	console.log(args);

	const files = fs.readdirSync(dirPath);

	console.log(files);
	files.forEach((file: string) => {
		fs.unlinkSync(file);
	});
});

// 刪除檔案(array)
ipcMain.handle('removeFile', (e, args: { files: string[] }) => {
	const { files } = args;

	files.forEach((file: string) => {
		const f = path.resolve(picPath, file);
		console.log(f);
		if (fs.existsSync(f)) {
			fs.unlinkSync(f);
		}
	});
});

export { picPath };
