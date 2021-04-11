// const i = 0;

self.addEventListener('message', event => {
	console.log(event.data);
	self.postMessage('123', '*');
});
