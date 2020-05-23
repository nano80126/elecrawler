'use strict';

import axios from 'axios';
import cheerio from 'cheerio';

import { ipcMain } from 'electron';

// const axios = require('axios');
// const cheerio = require('cheerio');
// const { ipcMain } = require('electron');

async function scrape(text, type) {
	const str = encodeURI(text);
	const url = `https://utaten.com/search/=/show_artists=1/layout_search_text=${str}/layout_search_type=${type}/`;

	const data = {
		error: null,
		list: []
	};
	await axios
		.get(url)
		.then(res => {
			const $ = cheerio.load(res.data);
			const h2 = $('body h2.contentBox__title');
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
					data.list.push(
						Object.freeze({
							title: songTitle,
							href: href,
							artist: songSinger,
							lyric: lyric,
							expanded: false
						})
					);
				}
			}
		})
		.catch(err => {
			data.error = err;
		});

	return data;
}

ipcMain.on('searchReq', async (e, args) => {
	const { type, text } = args;
	console.log(type, text);
	const ret = await scrape(text, type);
	e.sender.send('searchRes', ret);
});

// // Print the full HTML
// console.log(`Site HTML: ${$.html()}\n\n`);

// // Print some specific page content
// console.log(`First h1 tag: ${$('h1').text()}`);
