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

#### Translattion

サムネイル：縮圖

### Waiting

* [ ] Design an icon
* [ ] vue i18n

### Learning 

* [ ] Typescript (search nodejs + typescript)
* [ ] Test after changing to typescript

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
* [ ] Use debounce in typescript
* [x] ~~Fix nedb in electron 9~~
* [ ] Remove () after crawl

### Known bug 

### Vuex

* [ ] Migrate vuex to typescript (vuex-module-decorators)
* [ ] Use moudles player, common, lyric
* [ ] Fix vuex after using decorators

```
this.$store.state.player => this.$store.state.player.player
```

### Sharp 

* [x] Can't use sharp in main process