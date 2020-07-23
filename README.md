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


### Onprogress

* [x] Drop or paste an image and show real time
* [x] Upload image from clipboard and save in appropriate size
* [x] Save image with property size
* [x] Alias youtube url & image path with lyric object
* [x] Get mp3 from **Youtube**
* [x] Add global player(disable in route list)(disable when no youtube ID)
* [ ] Design an icon 
* [x] Open default browser for search
* [x] Divide Display.vue and Embed.vue
* [ ] Randon play

### Known bug 

* [ ] Changing avatar will not work until application refresh
* [ ] Volume bugs (different until adjust)
* [ ] List can't loading until reload
* [ ] Play broken if click twice when just initializing