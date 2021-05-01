import registerPromiseWorker from 'promise-worker/register';

registerPromiseWorker(msg => {
	if (msg.type === 'csv') {
		const number = msg.data;

		let count = 0;

		for (let i = 0; i < number * 100; i++) {
			count += i;
		}
		console.log(count);

		// setTimeout(() => {
		return { type: 'csv', data: count };
	}
});
