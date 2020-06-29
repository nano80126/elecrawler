import database from 'nedb';
import path from 'path';
import { remote } from 'electron';

console.log(remote.app.getPath('userData'));
// console.log(remote.app.getAppPath());

const historyDB = new database({
	filename: path.resolve(remote.app.getPath('userData'), 'history.db'),
	autoload: true
});

const listDB = new database({
	filename: path.resolve(remote.app.getPath('userData'), 'list.db'),
	autoload: true
});

// const lyricDB = new database({
// 	filename: path.resolve(remote.app.getPath('userData'), 'lyric.db'),
// 	autoload: true
// });

// const errorDB = new database({
// 	filename: path.resolve(remote.app.getPath('userData'), 'error.db'),
// 	autoload: true
// });

// export { historyDB, listDB, lyricDB };
export { historyDB, listDB };
