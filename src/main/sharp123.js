const sharp = require('sharp');

sharp('C:\\Users\\nano80126\\Pictures\\84388936_p0.jpg').toBuffer((err, Buffer, info) => {
	console.log(err);
	console.log(Buffer.length);
	console.log(info);
});

// ipcMain.handle('toBuffer', async (e, args) => {
// 	const { buffer } = args;

// 	let image = sharp(buffer);

// 	const { width } = await image.metadata();
// 	if (width && width > 1440) image = image.resize({ width: 1440 });

// 	return image.toBuffer();
// });
