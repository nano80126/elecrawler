# electron-lyric

This is a music player application with lyric crawler build by electron.

### Features
* Crawling lyric from **[歌詞検索サイト うたてん](https://utaten.com/)**
* Custom background image of each lyric card by
    * Extracting cover image from **Youtube**
    * Picking image from local drive 

### Languages
- Japanese
- English
- Chinese

### Migration 

* [ ] electron v10

### Waiting

* [ ] Design an icon (lightning + spider)
* [ ] vue i18n


### Update to electron v11

### Onprogress

* [x] Animation for panel window if lyricsKey Changed
* [x] Create new widnow for edit panel
* [x] Add global hotkey
* [x] Remove hot key of panel window
* [x] Close panel window if long time no use
* [x] Change playing title in shuffle mode
* [x] Try to fix volumn bugs
* [x] Call setPlayList in main.ts  
* [ ] Custom title and artist of lyric object
* [x] Test youtube embed api in production mode 
* [x] Open panel window in production mode
* [x] Scroll bar bugs in panel window (restart vs code)
* [ ] Create logo window
* [ ] Icon & logo (lightning + spider) 
* [x] Migrate image from development mode to production mode ?
    * Or use the same directory
* [x] Move overlay to v-main component
* [x] Hot key for play, pause, volume
* [x] Test volume include hotkey
* [x] Add shortcut hide/show window
* [x] Rewrite rect capture method
* [x] Media.vue mouseleave bug 
* [x] Media.vue capture bug if image width <= height
    * fix bug of bug and image
* [x] List.vue refresh wrong set lyrics object
* [x] Child i18n async with win 
* [ ] Express add CORS settings 
* [x] Add loop and shuffle in tray menu
* [x] Add volume to tray menu mute, 25%, 50%, 75%, 100%
* [x] Fileter bug of English name ?
* [x] Fix bugs not find out song name when clawler. ex. eternal blue
* [ ] Algorithm for shuffle reduce frequency for playing the same song in a short time
* [*] Register Alt + F12 local hotkey 
* [x] Search artist use ellipsis css
* [x] Title and artist lost (search and display) (utaten class changed)
* [x] Keywords looks odd (v-chip)
* [x] Keywords use slide in animation
* [x] fix edit panel
    * nodeintegration = false
    * enableRemoteModule = false
    * contextIsolation = true
* [x] Preload not work in production env
* [x] Can't build in production
* [x] Asyc volume and play mode between embed and tray 
* [x] ipcMain evnet for tray 
* [x] Debounce search event
* [x] Disable onRect when pushing 'esc' in media.vue
* [ ] Add worker plugin preparing something to do
* [ ] Check if video is exist in web worker 
* [x] Replace on new-window event use setWindowHandler
* [ ] Try to change window size use animation
* [x] Some video only allow to be play in Youtube (ex. 白日 / King Gnu [Covered by GARNiDELiA])
    * Youtube data API part status embedable can fix this problem
    * Jump to the url whitch can be embedded
* [*] Delete or comment no used code in background.ts
* [*] Add splash screen
* [x] Fix load pictures bugs
* [*] Splash loading by file
* [*] Test all module initializing time
* [ ] Add promise for each initialization functions
* [ ] Save locale setting in config (background) 
* [ ] Web worker for checking if video can be embeded
* [ ] Register ipcMain after win.show()
### Known bugs

* [ ] ini prototype pollution and fixed using resolution in package.json
* [ ] Mongodb bundle warning in production environment

### Vuex

### New Route

* [ ] sub play list

### New Page 

* [ ] First, create new branch
* [ ] Toolbox window 
* [ ] Browser window 

### bundle / build

### Make easy to migrate from development to production

