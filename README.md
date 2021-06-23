# ELECRAWLER

YouTube music player App create by electron

### Features
* Crawling lyric from **[歌詞検索サイト うたてん](https://utaten.com/)**
* Custom background image of each lyrics card by
    * Extracting cover image from **Youtube**
    * Picking image from local drive 

### Languages
- Japanese
- English
- Chinese

### To Do List

1. [ ] Custom title and artist of lyric object
1. [ ] Icon & logo (lightning + spider) 
1. [ ] Algorithm for shuffle reduce frequency for playing the same song in a short time
1. [ ] Add worker plugin preparing something to do
1. [x] ~Check if video is exist in web worker~
1. [ ] Try to change window size use animation
1. [x] ~Web worker for checking if video can be embeded~
1. [x] ~use axios recheck if video can be embeded~
    * create a background worker
1. [x] Register ipcMain after win.show()
1. [x] Clean interface between main and renderer
1. [x] This dependency was not found
    * mongodb-client-encryption in ./node_modules/mongodb/lib/encrypter.js
    To install it, you can run: npm install --save mongodb-client-encryption
1. [x] Panel add scroll bar
1. [x] Add portfinder for find free port
1. [ ] Add enum for fs.ts
1. [x] Use Promise.all for initialization
1. [x] Unable change background and lyrics after a video end
1. [x] Save port in playermodule for YouTube API
1. [ ] if route is list, maybe do not change lyrics and background image
    * not set to shuffle mode in the first time
    * often occurred
1. [x] Moving get port method to list.vue mounted 
1. [ ] Add next and last video mathods
1. [x] Change playing mode not affect tray menu
1. [ ] Add foot bar for copy right and resolution
1. [ ] Adjust media.vue height in panel
 
### Known Warning

1. Mongodb bundle warning in production environment

### New Views

* sub play list