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

0. [ ] Custom title and artist of lyric object
0. [ ] Create logo window
0. [ ] Icon & logo (lightning + spider) 
0. [ ] Express add CORS settings 
0. [ ] Algorithm for shuffle reduce frequency for playing the same song in a short time
0. [ ] Add worker plugin preparing something to do
0. [ ] Check if video is exist in web worker 
0. [ ] Try to change window size use animation
0. [ ] Add promise for each initialization functions
        * recover this, not a significant way
0. [ ] ~Web worker for checking if video can be embeded~
0. [ ] use axios recheck if video can be embeded
    * create a background worker
0. [ ] Register ipcMain after win.show()
0. [ ] Clean interface between main and renderer
0. [x] This dependency was not found
    * mongodb-client-encryption in ./node_modules/mongodb/lib/encrypter.js
    To install it, you can run: npm install --save mongodb-client-encryption
0. [x] Panel add scroll bar
0. [x] Add portfinder for find free port
0. [ ] Add enum for fs.ts
0. [ ] Use Promise.all for initialization
0. [ ] Unable change background and lyrics after a video end
0. [x] Save port in playermodule for YouTube API
0. [ ] if route is list, maybe do not change lyrics and background image
    * not set to shuffle mode in the first time
    * often occurred
0. [x] Moving get port method to list.vue mounted 

 
### Known Warning

1. Mongodb bundle warning in production environment

### New Views

* sub play list