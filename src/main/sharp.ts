import axios from 'axios';
import sharp from 'sharp';
import { ipcMain } from 'electron';

ipcMain.handle('videoCover', async (e, args) => {
	const imgUrl = `http://img.youtube.com/vi/${args.ID}/maxresdefault.jpg`;
	console.log(imgUrl);

	try {
		const res = await axios({ url: imgUrl, responseType: 'arraybuffer' });

		let image = sharp(Buffer.from(res.data));

		const { width } = await image.metadata();
		if (width && width > 1440) image = image.resize({ width: 1440 });

		return image.toBuffer({ resolveWithObject: true });
	} catch (error) {
		return { Error: true, message: error.message };
	}
});

ipcMain.handle('toBuffer', async (e, args) => {
	const { buffer, path } = args;

	try {
		let image = buffer ? sharp(Buffer.from(buffer)) : sharp(path);
		const { width } = await image.metadata();
		if (width && width > 1440) image = image.resize({ width: 1440 });

		return image.toFormat('jpeg').toBuffer({ resolveWithObject: true });
	} catch (error) {
		return { Error: true, message: error.message };
	}
});
