# electron-lyric

This is a lyric crawler build by electron.


### Features
* Crawling lyric from **[歌詞検索サイト うたてん](https://utaten.com/)**
* Custom background image of each lyric card by
    * Extracting cover image from **Youtube**
    * Picking image from local drive 

### Languages
- Japanese
- English
- Chinese

### Translattion

サムネイル：縮圖

### Waiting

* [ ] Design an icon (lightning + spider)
* [ ] vue i18n

### Onprogress

* [x] Drop or paste an image and show real time
* [x] Upload image from clipboard and save in appropriate size
* [x] Save image with property size
* [x] Alias youtube url & image path with lyric object
* [x] Get mp3 from **Youtube**
* [x] Add global player(disable in route list)(disable when no youtube ID)
* [x] Open default browser for search
* [x] Divide Display.vue and Embed.vue
* [x] Random play and change lyric object(testing) (almost deal in main.js)
* [x] Keep player property using store for all component (volumun) (testing)
* [x] Mark those lyrics has been added when searching (find/$name/)
* [x] Display.vue save colors
* [x] Save YouTube Url in array for get multiple url (what about image? get from first)
* [x] Delete specific lyric in List.vue, and multiple 
* [x] Add multiple url use mouse wheel
* [x] Get youtube data use youtube data v3 api
* [x] Simple lyric and background with no embeded youtube
* [x] Open dialog in main process
* [x] Use debounce in typescript
* [ ] ~~Fix nedb in electron 9~~
* [x] Remove () after crawl
* [x] Save video id which playing now
* [x] Fix bug that unable build
* [x] Update sharp.js
* [x] Remove some console.log not important
* [x] Open picture directory
* [x] Move save button to bottom 
* [x] replace all commit
* [ ] ~Make media.vue smaller, divide it.~
* [x] Try vuedraggable to switch youtube obj index
* [x] Fix toolbar of YouTube URL 
* [x] Show title of YouTube in Embed.vue
* [x] Random text color with marqee
* [x] let lyrci title and artist could be edit (open new window)
* [ ] ~Display.vue try use debounce for change background opacity~
* [x] Add pages dir for multiple pages, and popped window for edit panel
* [x] Save settings in json (main/sub text color, text align, language), use fs writefile in main process, path is userData
* [x] What trigger to save config? use @Watch
* [x] Rename all object key with unified name
* [x] searchRes edit to invoke / handle
* [x] Add interfaces of often used items
* [x] Add refresh in list.vue
* [x] Edit.vue video title slide in if got 
* [x] Animation for panel window if lyricsKey Changed
* [x] Create new widnow for edit panel
* [ ] Add global hotkey
* [x] Remove hot key of panel window
* [x] Close panel window if long time no use
* [x] Change playing title in shuffle mode
* [x] Try to fix volumn bugs
* [x] Call setPlayList in main.ts  
* [ ] Custom title and artist of lyric object
* [ ] Test youtube embed api in production mode 
* [x] Open panel window in production mode
* [x] Scroll bar bugs in panel window (restart vs code)
* [ ] Create logo window
* [ ] Icon & logo ( ) 



### Known bug 

* [ ] Mongodb bundle warning in production environment
* [ ] Production mode may not play video
    * some viedo will occured problem
    * will show can't play video
    * Must use in http server ?    
### Vuex

* [x] Migrate vuex to typescript (vuex-module-decorators)
* [x] Use moudles player, common, lyric
* [x] Fix vuex after using decorators

### sqlite

* [ ] Install sqlite 3 or 4 ?

### Sharp 

* [x] Can't use sharp in main process

### bundle / build

### Make easy to migrate from development to production

