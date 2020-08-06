# electron-lyric

This is a lyric crawler build by electron.


### Features
* Crawling lyric from **[歌詞検索サイト うたてん](https://utaten.com/)**
* Custom background image of each lyric card by
    * Extracting cover image from **Youtube**
    * Picking image from local drive 

### Language
- Japanese
- English
- Chinese

### Waiting

* [ ] Design an icon
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
* [ ] Random play and change lyric object(testing) (almost deal in main.js)
* [ ] Keep player property using store for all component (volumun) (testing)
* [ ] Mark those lyrics has been added when searching (find/$name/)
* [x] Display.vue save colors
* [ ] Save YouTube Url in array for get multiple url (what about image?)
* [ ] Delete specific lyric in List.vue, and multiple 
* [ ] Add multiple url use mouse wheel
* [ ] Get youtube data use youtube data v3 api

### Known bug 

* [ ] Changing avatar will not work until application refresh
* [ ] Volume bugs (different until adjust)
* [ ] List can't loading until reload
* [x] Play broken if click twice when just initializing
* [ ] Can't get duration of videio After CueVideoByID
* [x] Can't change lyric object in shuffle mode when route has changed