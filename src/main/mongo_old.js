const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, client) => {
	if (err) console.log(err.message);
	console.log('DB Connected');

	const db = client.db('test');
	// console.log(db);

	const list = db.collection('list');

	// list.insertMany([{ a: 1 }, { b: 2 }, { c: 3 }], (err, doc) => {
	// 	console.log('err', err);
	// 	console.log(doc);
	// });

	list.find({}).toArray((err, doc) => {
		console.log(err);
		console.log(doc);
	});

	setTimeout(() => {
		client.close();
	}, 2000);
});
