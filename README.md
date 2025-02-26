
北海道に移住してきたばかりで市町村名はほとんど読めません...
そこで、読み方を覚えるゲームを作成してみました！

ここからプレイ: https://anna-m-thomas.github.io/hokkaido_place_names
```
npm install
```
```
npm run serve
```

移動は、矢印キーを使ってください。鳩である理由は岩見沢市の市鳥であるためです。

ゲーム背景の地図は、[Leaflet.js](https://leafletjs.com/)で, 鳩と市長村名は[Pixi.js](https://pixijs.com/)を使っています。 Leaflet+Pixi.jsの組み合わせは[Leaflet.Pixioverlay](https://github.com/manubb/Leaflet.PixiOverlay)でできています。状態管理とUIは [Alpine.js](https://alpinejs.dev/) も使っています。

北海道での市長村名、その読み方と位置は下記の二つを引用しています。必要は情報をピッカップして、JSONファイルに変換　(別レポジトリーを[参照](https://github.com/Anna-M-Thomas/city_data).)
- 道内179市町村 https://www.pref.hokkaido.lg.jp/link/shichoson
[CC-BY4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)

- 北海道施設位置情報データベース【北海道】
https://www.harp.lg.jp/opendata/dataset/227.html
[CC-BY4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)

数年前に途中でやめた [ゲーム](https://github.com/Anna-M-Thomas/carbon-busters) を参考にしました。

鳩とミラボールは[いらすとや](https://www.irasutoya.com/)から。

Map tiles: [Stamen Terrain Background](https://leaflet-extras.github.io/leaflet-providers/preview/#filter=Stadia.StamenTerrainBackground).

参考資料
[Pixi.js tutorial](https://github.com/kittykatattack/learningPixi) 
[Using gh-pages](https://github.com/turingschool-examples/webpack-starter-kit/blob/main/gh-pages-procedure.md)


***
I just moved to Hokkaido and don't know how to read any of the cities, so I made a game to practice!
Play here: https://anna-m-thomas.github.io/hokkaido_place_names

```
npm install
```
```
npm run serve
```

Use the arrow keys to move. The player is a pigeon because that's Iwamizawa's city bird.

The game uses [Leaflet.js](https://leafletjs.com/) for the map, [Pixi.js](https://pixijs.com/)  for the pigeon sprite and city names, [Leaflet.Pixioverlay](https://github.com/manubb/Leaflet.PixiOverlay) to bring together the Pixi and Leaflet bits, and [Alpine.js](https://alpinejs.dev/) for shared state management and UI.

The list of cities in Hokkaido and their locations come from the following two sources. I combined the necessary information into a single JSON file (see separate repository [here](https://github.com/Anna-M-Thomas/city_data).)
- 道内179市町村 https://www.pref.hokkaido.lg.jp/link/shichoson
[CC-BY4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)

- 北海道施設位置情報データベース【北海道】
https://www.harp.lg.jp/opendata/dataset/227.html
[CC-BY4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)

I used a [previous project](https://github.com/Anna-M-Thomas/carbon-busters) that I'd left unfinished 、as a reference. 

Pigeon and disco ball from [Irasutoya](https://www.irasutoya.com/).

Map tiles: [Stamen Terrain Background](https://leaflet-extras.github.io/leaflet-providers/preview/#filter=Stadia.StamenTerrainBackground).

Useful references
[Pixi.js tutorial](https://github.com/kittykatattack/learningPixi) by kittycatattack 
[Using gh-pages](https://github.com/turingschool-examples/webpack-starter-kit/blob/main/gh-pages-procedure.md) to deploy game 