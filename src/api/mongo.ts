// import { MongoClient } from 'mongodb';
import { MongoClient } from 'mongodb';
import { ipcMain } from 'electron';
import moment from 'moment';
import { EmongoOn } from '@/types/enum';

/**use this after calling createMongoConnection()  */
let mongoCLient: MongoClient;

/**建立Mongo連線 */
export function createMongoConnection(): Promise<void> {
	return new Promise((resolve) => {
		mongoCLient = new MongoClient('mongodb://localhost:27017/lyrics', {
			useUnifiedTopology: true,
			auth: { user: 'lyricsAdmin', password: 'elecrawler' },
			authMechanism: 'SCRAM-SHA-1',
		});

		mongoCLient.connect((err) => {
			if (err) console.log(err);

			const db = mongoCLient.db('lyrics');
			const history = db.collection('history');
			const list = db.collection('list');

			// 刪除
			history.deleteMany({
				datetime: {
					$lt: moment().add(-15, 'days').format('YYYY-MM-DD HH:mm:ss'),
				},
			});

			ipcMain.handle(EmongoOn.HISTORYFIND, async (e, args) => {
				return await history
					.find(args.query || {})
					.sort(args.sort || {})
					.limit(5)
					.toArray();
			});

			ipcMain.handle(EmongoOn.HISTORYSAVE, async (e, args) => {
				const ret = await history.updateOne(args.query, args.data, { upsert: true });
				return ret.result;
			});

			ipcMain.handle(EmongoOn.LISTFIND, async (e, args) => {
				return await list
					.find(args.query || {})
					.sort(args.sort || {})
					.toArray();
			});

			ipcMain.handle(EmongoOn.LISTFINDONE, async (e, args) => {
				return await list.findOne(args.query);
			});

			ipcMain.handle(EmongoOn.LISTSAVE, async (e, args) => {
				await list.createIndex({ lyricsKey: 1 }, { unique: true });

				const ret = await list.updateOne(args.query, args.data, { upsert: true });
				return ret.result;
			});

			ipcMain.handle(EmongoOn.LISTREMOVE, async (e, args) => {
				const ret = await list.deleteMany(args.query);
				return ret.result;
			});

			ipcMain.handle(EmongoOn.LISTREMOVEONE, async (e, args) => {
				const ret = await list.deleteOne(args.query);
				return ret.result;
			});
			// ipcMain.handle('listAdd', (e, args) => {
			// 	list.createIndex({ uniqueKey: 1 }, { unique: true }, err => {
			// 		if (err) console.log(err);
			// 	});

			// 	list.update(args.query, args.data, { upsert: true }, err => {
			// 		console.log(err);
			// 	});

			/**處理關閉資料庫命令 */
			// ipcMain.on('mongoDisc', () => {
			// 	client.close();
			// });
			resolve();
		});

		// MongoClient.connect(
		// 	'mongodb://localhost:27017',
		// 	{
		// 		// useUnifiedTopology: true,
		// 		auth: { user: 'lyricsAdmin', password: 'elecrawler' },
		// 		// authMechanism: 'SCRAM-SHA-256',
		// 	},
		// 	(err, client) => {

		// 	}
		// );
	});
}

export { mongoCLient };
