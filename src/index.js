import * as L from 'leaflet'
import { Application, Ticker } from 'pixi.js'
import 'leaflet-pixi-overlay'
import { setupKeyboard } from './setupKeyboard.js'
import { createBird, createCities, createDiscoBall } from './sprites.js'
import { ColorHelper } from './colorHelper.js'
import './store.js'
import Alpine from 'alpinejs'
import './css/style.css';

// 岩見沢市の位置
const startLatLng = [43.19617, 141.77589]
// 北海道は179市町村
const numberOfCities = 179
let currentZoom = 11

// 地図生成
const mymap = L.map('mapid', {
  doubleClickZoom: false,
  keyboard: false,
  zoomControl: false,
  scrollWheelZoom: false,
  touchZoom: false,
}).setView(startLatLng, currentZoom)

L.tileLayer(
  'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png',
  {
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20,
    tileSize: 512,
    zoomOffset: -1,
    crossOrigin: true,
  }
).addTo(mymap)

let firstDraw = true
const app = new Application()
app.stage.sortableChildren = true
const bird = await createBird(app.stage)
const cities = await createCities(app.stage)
// 祝いモード関連
let discoTimes = 0
const colorHelper = new ColorHelper()

// pixiOverlay生成
const pixiOverlay = L.pixiOverlay(async function (utils, event) {
  const container = utils.getContainer()
  const renderer = utils.getRenderer()
  const project = utils.latLngToLayerPoint
  const map = utils.getMap()
  const scale = utils.getScale()

  // render初回は、鳩と視聴村名を地図上で配置したいところへ
  if (firstDraw) {
    const { x, y } = project(startLatLng)
    bird.x = x
    bird.y = y
    bird.scale.set(0.4 / scale)
    cities.forEach(city => {
      const { x, y } = project([city.data.lat, city.data.long])
      city.x = x
      city.y = y
      city.scale.set(1 / scale)
    })
    firstDraw = false
  }

  switch (event.type) {
    // 鳩が動いたら地図が動きを追う
    case 'move':
      const newCoords = utils.layerPointToLatLng([bird.x, bird.y])
      map.panTo(newCoords)
      break
    // 市町村の読み方当たったら、色を変更、クリックに反応しなくする
    case 'correct_city':
      event.city.style.fill = '#87CEEB' // light blue
      event.city.interactive = false
      break
    // ミラーボールを地図の上中央に配置
    case 'disco_ball':
      const bounds = map.getBounds()
      const center = bounds.getCenter()
      const { x, y } = project([bounds.getNorth() - 0.04, center.lng])
      event.ball.x = x
      event.ball.y = y
      event.ball.scale.set(0.5 / scale)
      break
    // 勝った時の祝いモード
    case 'happy_disco_mode':
      currentZoom = currentZoom == 12 ? 11 : 12
      map.setZoom(currentZoom, { animate: false })
      renderer.background.color = colorHelper.getNextColor()
      bird.dance()
      break
    default:
    // Do nothing
  }

  renderer.render(container)
}, app.stage)

pixiOverlay.addTo(mymap)

const keys = setupKeyboard(bird)

// 市町村名をクリックした時、読み方を聞く
cities.forEach(city => {
  city.on('pointerdown', event =>
    Alpine.store('UI').askQuestion(event.target, pixiOverlay)
  )
})

Ticker.shared.add(delta => gameLoop(delta))

function gameLoop(delta) {
  play(delta)
}

function play() {
  const previousX = bird.x
  const previousY = bird.y
  bird.x += bird.vx
  bird.y += bird.vy

  // ライフポイントが０以下になったらゲーム終了
  if (Alpine.store('UI').health.isNegativeHealth()) {
    pixiOverlay.destroy()
  }

  // すべての市町村を読めたらゲームに勝つ
  if (Alpine.store('UI').totalCorrect == numberOfCities) {
    Alpine.store('UI').totalCorrect = 0
    getReadyForHappyDiscoMode()
  }
  // 勝った時の祝いモード中。
  // Ticker(描画のタイマー)通りだとタイミングが早すぎる、呼ぶ回数を減らす
  if (discoTimes > 0) {
    if (discoTimes % 25 == 0) {
      pixiOverlay.redraw({ type: 'happy_disco_mode' })
    }
    discoTimes--
  }

  // 鳩が動いたら、描画
  if (previousX != bird.x || previousY != bird.y) {
    pixiOverlay.redraw({ type: 'move' })
  }
}

// 祝いモード前の準備
async function getReadyForHappyDiscoMode() {
  Alpine.store('UI').resultWindow = false
  keys.unsubscribeAll()
  alert(
    'Congratulations!\nYou will now enter HAPPY DISCO MODE.\nThere are flashing effects!\nおめでとうございます！\nハッピーディスコモードに入ります。\nピカピカするのでご注意ください！'
  )
  const ball = await createDiscoBall(app.stage)
  pixiOverlay.redraw({ type: 'disco_ball', ball: ball })
  await bird.enterCoolMode()
  pixiOverlay.redraw({})
  discoTimes = 1500
}
