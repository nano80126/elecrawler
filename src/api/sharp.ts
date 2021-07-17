import axios from 'axios';
import sharp from 'sharp';
import { ipcMain, dialog } from 'electron';
import { picPath } from './fs';
import { EsharpOn } from '@/types/enum';

/**註冊 sharp 處理程序 */
export function registerSharpHandler(): Promise<void> {
	return new Promise((resolve) => {
		ipcMain.handle(EsharpOn.GETVIDEOIMAGE, async (e, args) => {
			const imgUrl = args.ID ? `http://img.youtube.com/vi/${args.ID}/maxresdefault.jpg` : args.URL;
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

		ipcMain.handle(EsharpOn.LOADIMAGEBYDIALOG, async () => {
			try {
				const path = await dialog.showOpenDialog({
					filters: [{ name: 'Images', extensions: ['jpg', 'png', 'bmp'] }],
				});

				if (!path.canceled) {
					const filePath = path.filePaths[0];
					let image = sharp(filePath);

					const { width } = await image.metadata();
					if (width && width > 1400) image = image.resize({ width: 1440 });

					return image.toBuffer({ resolveWithObject: true });
				} else {
					return { data: null };
				}
			} catch (error) {
				throw new Error(error);
				// return { Error: true, message: error.message };
			}
		});

		ipcMain.handle(EsharpOn.LOADIMAGEBYPATH, async (e, args) => {
			const { path } = args;

			try {
				// 先判斷是否為 Array
				if (!Array.isArray(path)) {
					return sharp(path).toBuffer({ resolveWithObject: true });
				} else {
					const promiseArr = path.map((p: string) => {
						if (p) {
							return sharp(p).toBuffer({ resolveWithObject: true });
						} else {
							return undefined;
						}
					});
					return Promise.all(promiseArr);
				}
			} catch (error) {
				throw new Error(error);
			}
		});

		ipcMain.handle(EsharpOn.TOBUFFER, async (e, args) => {
			const { buffer, path } = args;

			try {
				let image = buffer ? sharp(Buffer.from(buffer)) : sharp(path);
				const { width } = await image.metadata();
				if (width && width > 1440) image = image.resize({ width: 1440 });

				return image.toFormat('jpeg').toBuffer({ resolveWithObject: true });
			} catch (error) {
				throw new Error(error);
				// return { Error: true, message: error.message };
			}
		});

		ipcMain.handle(EsharpOn.SAVEIMAGE, async (e, args) => {
			const { buffer, key, size } = args;
			// size = {left: x, top: y, width: w, height: h}
			try {
				const image = sharp(Buffer.from(buffer));

				const promise = [];
				promise.push(image.clone().toFormat('jpeg').toFile(`${picPath}\\${key}.jpg`));

				if (size.width > 0 && size.height > 0) {
					promise.push(
						image
							.clone()
							.extract(size)
							.resize(128, 128, { fit: sharp.fit.outside, withoutEnlargement: true })
							.toFormat('jpeg')
							.toFile(`${picPath}\\${key}.icon.jpg`)
					);
				}
				return Promise.all(promise);
			} catch (error) {
				throw new Error(error);
				// return { Error: true, message: error.message };
			}
		});

		resolve();
	});
}
