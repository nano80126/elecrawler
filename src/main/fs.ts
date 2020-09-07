import fs, { exists } from 'fs';
import path from 'path';
import { app, ipcMain } from 'electron';

const picPath =
	process.env.NODE_ENV == 'development'
		? path.resolve(app.getPath('pictures'), 'lyric_scrawer')
		: path.resolve(app.getPath('exe'), '../picturess');

console.log(picPath);

// create picture directory
ipcMain.on('mkPicDir', () => {
	const exist = fs.existsSync(picPath);
	if (!exist) {
		fs.mkdir(picPath, err => {
			if (err) console.log(err);
		});
	}
});

ipcMain.on('emptyDir', (e, args: { dirPath: string }) => {
	const { dirPath } = args;
	console.log(args);

	const files = fs.readdirSync(dirPath);

	console.log(files);
	files.forEach((file: string) => {
		fs.unlinkSync(file);
	});
});

// remove files from file array
ipcMain.on('removeFile', (e, args: { files: string[] }) => {
	const { files } = args;

	console.log(args);

	files.forEach((file: string) => {
		if (fs.existsSync(file)) {
			fs.unlinkSync(file);
		}
	});
});
