I just moved to Hokkaido and don't know how to read any of the cities, so I made a game to practice!
Play here: https://anna-m-thomas.github.io/hokkaido_place_names
The player is a pigeon because that's Iwamizawa's city bird.

The game uses [Leaflet.js](https://leafletjs.com/) for the map, [Pixi.js](https://pixijs.com/)  for the pigeon sprite and city names, [Leaflet.Pixioverlay](https://github.com/manubb/Leaflet.PixiOverlay) to bring together the Pixi and Leaflet bits, and [Alpine.js](https://alpinejs.dev/) for shared state management and UI.

The list of cities in Hokkaido and their locations come from the following two sources. I combined the necessary information into a single JSON file (see separate repository [here](https://github.com/Anna-M-Thomas/city_data).)
- 道内179市町村 https://www.pref.hokkaido.lg.jp/link/shichoson
[CC-BY4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)

- 北海道施設位置情報データベース【北海道】
https://www.harp.lg.jp/opendata/dataset/227.html
[CC-BY4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)

I used a [previous project](https://github.com/Anna-M-Thomas/carbon-busters) that I'd left unfinished as a reference. 

Pigeon and disco ball from [Irasutoya](https://www.irasutoya.com/).

Map tiles: [Stamen Terrain Background](https://leaflet-extras.github.io/leaflet-providers/preview/#filter=Stadia.StamenTerrainBackground).

Useful references
[Pixi.js tutorial](https://github.com/kittykatattack/learningPixi) by kittycatattack 
[Using gh-pages](https://github.com/turingschool-examples/webpack-starter-kit/blob/main/gh-pages-procedure.md) to deploy game 