'use strict';

import axios from 'axios';
import cheerio from 'cheerio';

import { ipcMain } from 'electron';

// const axios = require('axios');
// const { ipcMain } = require('electron');

async function listScraper(artist, title) {
	const att = artist ? encodeURI(artist) : '';
	const tle = title ? encodeURI(title) : '';
	const url = `https://utaten.com/lyric/search?sort=&artist_name=${att}&title=${tle}&form_open=0&show_artists=1`;

	const data = {
		error: null,
		list: []
	};
	await axios
		.get(url)
		.then(res => {
			const $ = cheerio.load(res.data);
			const h2 = $('body div#container > div#contents > main h2.contentBox__title').first(); // first child
			const table = h2.next('div.contentBox__body').children('table');
			const trs = table.children('tbody').children('tr');
			// const trs = contextBody.children('table');
			// console.log($('body div.contentBox__body table tbody').html());

			for (let i = 1; i < trs.length; i++) {
				if (trs.eq(i).children().length >= 2) {
					const eq = trs.eq(i).children('td');
					const eq2 = eq.next();

					// if (eq.children().length > 2) {
					const aTitle = eq.find('> p.searchResult__title > a');
					const aName = eq.find('> p.searchResult__name > a');

					const songTitle = aTitle.text().replace(/^\s+|\s+$/g, '');
					const href = aTitle.attr('href');
					const songSinger = aName.text().replace(/^\s+|\s+$/g, '');
					const lyric = eq2
						.children('a')
						.text()
						.replace(/^\s+|\s+$/g, '');

					// console.log(songTitle, href, songSinger);
					// console.log(lyric);
					data.list.push({
						id: i,
						title: songTitle,
						href: href,
						artist: songSinger,
						lyric: lyric
						// expanded: false
					});
				}
			}
		})
		.catch(err => {
			data.error = err;
		});

	return data;
}

async function lyricGetter(subUrl) {
	const url = `https://utaten.com/${subUrl}`;

	const data = { error: null };

	await axios
		.get(url)
		.then(res => {
			const $ = cheerio.load(res.data);
			const main = $('body div#container > div#contents > main');

			const title = main.find('h1.movieTtl');
			const mainTxt = title
				.children('span.movieTtl_mainTxt')
				.text()
				.replace(/^「|」$/g, '');
			const artist = title
				.children('a.boxArea_artists_move_top')
				.text()
				.replace(/^\s+|\s+$/g, '');

			const lyricBody = main.find('div.lyricBody');
			const lyricContent = lyricBody
				.children('.medium')
				.children('.hiragana')
				.html();

			Object.assign(data, {
				lyricKey: subUrl.match(/(?<=^\/lyric\/)\w+(?=\/$)/)[0],
				url: subUrl,
				mainTxt,
				artist,
				lyricContent
			});
		})
		.catch(err => {
			data.error = err;
		});

	return data;
}

ipcMain.on('searchReq', async (e, args) => {
	const { artist, title } = args;
	const ret = await listScraper(artist, title);
	e.sender.send('searchRes', ret);
});

ipcMain.on('getLyric', async (e, args) => {
	const { url } = args;
	const ret = await lyricGetter(url);
	// console.log(url);

	e.sender.send('lyricRes', ret);
});
// // Print the full HTML
// console.log(`Site HTML: ${$.html()}\n\n`);

// // Print some specific page content
// console.log(`First h1 tag: ${$('h1').text()}`);
