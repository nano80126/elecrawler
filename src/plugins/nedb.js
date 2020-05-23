import database from 'nedb';
import path from 'path';
import { remote } from 'electron';

// console.log(remote.app.getPath('userData'));
// console.log(remote.app.getAppPath());

const listDB = new database({
	filename: path.resolve(remote.app.getPath('userData'), 'list.db'),
	autoload: true
});

// const errorDB = new database({
// 	filename: path.resolve(remote.app.getPath('userData'), 'error.db'),
// 	autoload: true
// });

export { listDB };
