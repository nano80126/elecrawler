// const i = 0;

self.addEventListener('message', event => {
	console.log(event);

	// let index;
	let a = 0;
	// const start = new Date().valueOf();
	for (let index = 0; index < 1000; index++) {
		//
		a += index;
	}
	// const end = new Date().valueOf();
	// const span: number = end - start;

	self.postMessage({ span: a }, null);
});
