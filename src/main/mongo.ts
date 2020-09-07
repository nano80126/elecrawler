import { MongoClient } from 'mongodb';
import { ipcMain } from 'electron';
import { contains } from 'cheerio';
// import { argv } from 'process';

let mongoCLient: MongoClient;

MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, client) => {
	if (err) throw err;
	console.log('running');
	mongoCLient = client;

	const db = client.db('lyrics');
	const history = db.collection('history');
	// const list = db.collection('list');

	// list.insert({ a: 123 }, (err, doc) => {
	// 	console.log(err);
	// 	console.log(doc);
	// });

	// list.find({}).toArray((err, doc) => {
	// 	console.log(err);
	// 	console.log(doc);
	// });

	// history.deleteMany({}, (err, doc) => {
	// 	// console.log(err);
	// 	console.log(doc.result);
	// });

	ipcMain.handle('historyUpsert', async (e, args) => {
		console.log(args);
		const ret = await history.updateOne(args.query, args.data, { upsert: true });
		return ret.result;
	});

	ipcMain.handle('historyFind', async () => {
		return await history
			.find({})
			.sort({ datetime: -1 })
			.limit(5)
			.toArray();
	});

	// ipcMain.handle('listAdd', (e, args) => {
	// 	list.createIndex({ uniqueKey: 1 }, { unique: true }, err => {
	// 		if (err) console.log(err);
	// 	});

	// 	list.update(args.query, args.data, { upsert: true }, err => {
	// 		console.log(err);
	// 	});

	// 	return 'done';
	// });

	// list.update({}, {upd})

	// client.close();

	ipcMain.on('mongoDisc', () => {
		client.close();
	});
});

export { mongoCLient };
