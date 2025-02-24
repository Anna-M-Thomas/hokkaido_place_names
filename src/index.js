import * as L from 'leaflet'
import { Application, Ticker, Assets, Sprite } from 'pixi.js'
import 'leaflet-pixi-overlay'
import { setupKeyboard } from './setupKeyboard.js'
import { createBird, createCities, createDiscoBall } from './sprites.js'
import { ColorHelper} from './colorHelper.js'
import './store.js'
import Alpine from 'alpinejs'

// 岩見沢市の位置(?)
const startLatLng = [43.19617, 141.77589]
// Number of cities in Hokkaido
const numberOfCities = 1 // 35 + 129 + 15 = 179
let currentZoom = 11

//　Making the map
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
// Used for counter during finale
let discoTimes = 0
const colorHelper = new ColorHelper();
const app = new Application()
app.stage.sortableChildren = true
const bird = await createBird(app.stage)
const cities = await createCities(app.stage)

// Making pixi overlay
// There's an option called "showRedrawOnMove" that redraws the pixi layer if the map moves
// I'm not using because I want redraw to trigger when the bird moves, and the map to follow the bird
const pixiOverlay = L.pixiOverlay(async function (utils, event) {
  const container = utils.getContainer()
  const renderer = utils.getRenderer()
  const project = utils.latLngToLayerPoint
  const map = utils.getMap()
  const scale = utils.getScale()

  // Place bird and city names on map
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
    // "camera" (map) moves if player moves
    case 'move':
      const newCoords = utils.layerPointToLatLng([bird.x, bird.y])
      map.panTo(newCoords)
      break
    // Change city's color and remove interactivity when it was correctly answered
    case 'correct_city':
      event.city.style.fill = '#87CEEB'
      event.city.interactive = false
      break
    // Place disco ball at map top center
    case 'disco_ball':
      const bounds = map.getBounds()
      const center = bounds.getCenter()
      const { x, y } = project([bounds.getNorth() - 0.04, center.lng])
      event.ball.x = x
      event.ball.y = y
      event.ball.scale.set(0.5 / scale)
      break
    // Game finale
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

//Put pixi overlay on map
pixiOverlay.addTo(mymap)

// Set up keyboard
const keys = setupKeyboard(bird)

// Event listeners for each city
cities.forEach(city => {
  city.on('pointerdown', event =>
    Alpine.store('UI').askQuestion(event.target, pixiOverlay)
  )
})

// Start the game loop
Ticker.shared.add(delta => gameLoop(delta))

//　Update the current game state
function gameLoop(delta) {
  play(delta)
}

function play() {
  const previousX = bird.x
  const previousY = bird.y
  bird.x += bird.vx
  bird.y += bird.vy

  // Out of health, game ends
  if (Alpine.store('UI').health.isNegativeHealth()) {
    pixiOverlay.destroy()
  }

  // win!
  if (Alpine.store('UI').totalCorrect == numberOfCities) {
    Alpine.store('UI').totalCorrect = 0
    getReadyForHappyDiscoMode()
  }
  // The ticker is too fast for zooming map in and out during finale screen
  if (discoTimes > 0) {
    if (discoTimes % 25 == 0) {
      pixiOverlay.redraw({ type: 'happy_disco_mode' })
    }
    discoTimes--
  }

  if (previousX != bird.x || previousY != bird.y) {
    // Redraw pixi overlay and move map if bird moved
    pixiOverlay.redraw({ type: 'move' })
  }
}

async function getReadyForHappyDiscoMode() {
  Alpine.store('UI').resultWindow = false
  keys.unsubscribeAll()
  const ball = await createDiscoBall(app.stage)
  pixiOverlay.redraw({ type: 'disco_ball', ball: ball })
  await bird.enterCoolMode()
  pixiOverlay.redraw({})
  discoTimes = 1500
}
