import PromiseWorker from 'promise-worker';
import Worker from 'worker-loader!./worker.ts';
// import VtechWorker from 'worker-loader!./vtech/';

// const promiseWorker = new PromiseWorker(worker);

const worker = new Worker();
const promiseWorker = new PromiseWorker(worker);

// const vtechWorker = new VtechWorker();
// const vtechPromiseWorker = new PromiseWorker2(vtechWorker);

// Leave for example
// const send = (msg: string) => {
// 	return promiseWorker.postMessage({
// 		type: 'message',
// 		message: msg
// 	});
// };

// // const analyzeCSV = async (file: File) => {
const runWorker = () => {
	return promiseWorker.postMessage({
		type: 'csv',
		data: 10
	});
};

export default { runWorker };
