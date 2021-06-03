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

* [ ] Custom title and artist of lyric object
* [ ] Create logo window
* [ ] Icon & logo (lightning + spider) 
* [ ] Express add CORS settings 
* [ ] Algorithm for shuffle reduce frequency for playing the same song in a short time
* [ ] Add worker plugin preparing something to do
* [ ] Check if video is exist in web worker 
* [ ] Try to change window size use animation
* [ ] Add promise for each initialization functions
    * recover this, not a significant way
* [ ] ~Web worker for checking if video can be embeded~
* [ ] use axios recheck if video can be embeded
    * create a background worker
* [ ] Register ipcMain after win.show()
* [ ] Clean interface between main and renderer
* [ ] This dependency was not found
    * mongodb-client-encryption in ./node_modules/mongodb/lib/encrypter.js
    To install it, you can run: npm install --save mongodb-client-encryption
* [ ] Panel add scroll bar
* [ ] Add portfinder for find free port

### Known Warning

1. Mongodb bundle warning in production environment

### New Views

* sub play list