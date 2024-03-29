'use strict';

import axios from 'axios';
import cheerio from 'cheerio';
// const cheerio = require('cheerio');

import { ipcMain } from 'electron';
import { IlistCrawled, IlyricsCrawled } from '@/types';
import { EcrawlerOn } from '@/types/enum';

// const axios = require('axios');
// const { ipcMain } = require('electron');

async function listCrawl(artist: string, title: string): Promise<{}> {
	// const att = artist ? encodeURI(artist) : '';
	// const tle = title ? encodeURI(title) : '';
	// const url = `https://utaten.com/lyric/search?sort=&artist_name=${att}&title=${tle}&form_open=0&show_artists=1`;

	const opt = {
		sort: null,
		artist_name: artist,
		title: title,
		form_open: 0,
		show_artists: 1,
	};

	const data: { error: Error | null; list: Array<IlistCrawled> } = {
		error: null,
		list: [],
	};
	await axios
		.get('https://utaten.com/lyric/search', { params: opt })
		.then((res) => {
			// console.log(res.config.params);

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
						artist: songSinger,
						title: songTitle,
						lyricsUrl: href || '',
						lyricsShort: lyric,
						// expanded: false
					});
				}
			}
		})
		.catch((err) => {
			data.error = new Error(err);
		});

	return data;
}

async function lyricsCrawl(subUrl: string): Promise<{}> {
	const url = `https://utaten.com/${subUrl}`;

	const data: { error: Error | null; obj?: IlyricsCrawled } = { error: null };

	await axios
		.get(url)
		.then((res) => {
			const $ = cheerio.load(res.data);
			const main = $('body div#container > div#contents > main');

			let mainTxt: string | undefined = undefined;
			let artist: string | undefined = undefined;

			// UtaTen 更新
			// two different title and artist classes
			let title = main.find('h1.movieTtl'); // old class
			if (title.length < 1) {
				// 若old class不存在
				title = main.find('div.newLyricTitle'); // 使用新的 class 尋找
				const newMainTxt = title.children('h1.newLyricTitle__main').text().match(/「.+」/);
				if (newMainTxt) mainTxt = newMainTxt[0].replace(/^「|」$/g, '');

				const newArtist = main
					.find('div.lyricData')
					.children('div.lyricData__main')
					.children('dl.newLyricWork')
					.children('dt.newLyricWork__name')
					.children('a')
					.text()
					.replace(/^\s+|\s+$/g, '');
				artist = newArtist;
			} else {
				//
				const oldMainTxt = title
					.children('span.movieTtl_mainTxt')
					.text()
					.replace(/^「|」$/g, '') // 刪除 「」
					.replace(/\s?\(.*\)$/, ''); // 刪除 (...) 與內部文字
				mainTxt = oldMainTxt;

				const oldArtist = title
					.children('a.boxArea_artists_move_top')
					.text()
					.replace(/^\s+|\s+$/g, ''); // 刪除前後空白(\s)
				artist = oldArtist;
			}

			const lyricBody = main.find('div.lyricBody');
			const lyricContent = lyricBody.children('.medium').children('.hiragana').html();

			Object.assign(data, {
				obj: {
					artist: artist,
					title: mainTxt,
					lyricsUrl: subUrl,
					lyricsKey: subUrl.match(/(?<=^\/lyric\/)\w+(?=\/$)/)?.[0],
					lyrics: lyricContent,
				},
			});
		})
		.catch((err) => {
			data.error = new Error(err);
		});

	return data;
}

/**註冊爬蟲程序 */
export function crawlerRegister(): Promise<void> {
	return new Promise((resolve) => {
		ipcMain.on(EcrawlerOn.LIST, async (e, args) => {
			const { artist, title } = args;
			const ret = await listCrawl(artist, title);
			e.sender.send('searchRes', ret);
		});

		ipcMain.handle(EcrawlerOn.LIST, async (e, args) => {
			const { artist, title } = args;
			const ret = await listCrawl(artist, title);
			return ret;
		});

		ipcMain.on(EcrawlerOn.LYRICS, async (e, args: { url: string; exist: boolean }) => {
			const { url, exist } = args;
			const ret = await lyricsCrawl(url);
			Object.assign(ret, { exist });

			e.sender.send('lyricRes', ret);
		});

		ipcMain.handle(EcrawlerOn.LYRICS, async (e, args: { url: string; exist: boolean }) => {
			const { url, exist } = args;
			const ret = await lyricsCrawl(url);
			Object.assign(ret, { exist });

			return ret;
		});

		// resolve('add handler of crawler');
		resolve();
	});
}
