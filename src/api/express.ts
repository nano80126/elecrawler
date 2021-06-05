// import { ipcMain } from 'electron';
import { ipcMain } from 'electron';
import express from 'express';
import path from 'path';
import portfinder from 'portfinder';
// import { parentPort, isMainThread } from 'worker_threads';
// import { app as electron } from 'electron';

/**初始化express */
export function initializeExpress(): Promise<string> {
	return new Promise((resolve) => {
		const app = express();
		const router = express.Router();

		// const port = (process.env.VUE_APP_PORT as unknown as number) || 4000;

		// for CORS(Cross-Origin Resource Sharing) settings
		app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header(
				'Access-Control-Allow-Headers',
				'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
			);
			// res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
			res.header('Access-Control-Allow-Methods', 'POST, GET');

			next();
		});

		// for router and externals static js and css, meaning iframe_api.js in this project
		app.use('/', router).use('/', express.static(__dirname));
		// externals js and css need this, in this project is iframe_api.js
		// app.use('/', express.static(__dirname));

		router
			.get('/', (req, res) => {
				res.sendFile(path.resolve(__dirname, 'index.html'));
			})
			.get('/splash', (req, res) => {
				res.sendFile(path.resolve(__dirname, 'splash.html'));
			})
			.get('/panel', (req, res) => {
				res.sendFile(path.resolve(__filename, 'panel.html'));
			})
			.get('/test', (req, res) => {
				res.send('This is an test message');
			});

		// router.get('/splash', (req, res) => {
		// 	res.sendFile(path.resolve(__dirname, 'splash.html'));
		// });

		// router.get('/panel', (req, res) => {
		// 	res.sendFile(path.resolve(__dirname, 'panel.html'));
		// });

		// router.get('/test', (req, res) => {
		// 	res.send('This is as test message');
		// });

		// 搜尋可用 port
		portfinder.getPort(
			{
				startPort: 4000,
				port: 4000,
				stopPort: 4050,
			},
			(err, port) => {
				if (err) console.log(err);

				ipcMain.handle('getPort', () => {
					return port;
				});

				app.listen(port, 'localhost', () => {
					console.log(`Http Server Started On Port ${port} :)`);
					resolve('create express server successfully');
				});
			}
		);
		// app.listen(port, 'localhost', () => {
		// 	console.log(`Http Server Started On Port ${port} :)`);
		// 	resolve('create express server successfully');
		// });
	});
}
