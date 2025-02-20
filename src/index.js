import * as L from 'leaflet'
import * as PIXI from 'pixi.js'
import 'leaflet-pixi-overlay'
import { setupKeyboard } from './keyboard'

const startLatLng = [43.11, 141.45]
//Making the map
const mymap = L.map('mapid').setView(startLatLng, 12)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
  tileSize: 512,
  zoomOffset: -1,
}).addTo(mymap)

// Make pixi app, add stuff
const app = new PIXI.Application()
let firstDraw = true


// Make sprite
var birdTexture = await PIXI.Assets.load(
  'img/bird_hato.png'
)
const bird = PIXI.Sprite.from(birdTexture)
bird.anchor.set(0.5, 0.5)

// add sprite
app.stage.addChild(bird)

//Making pixi overlay from stage
const pixiOverlay = L.pixiOverlay(function (utils, event) {
  const container = utils.getContainer()
  const renderer = utils.getRenderer()

  // "camera" (map) moves if player moves
  if (event.type == 'move') {
    const map = utils.getMap()
    const newCoords = utils.layerPointToLatLng([bird.x, bird.y])
    map.panTo(newCoords)
  }

  //initial velocity, position
  if (firstDraw) {
    const project = utils.latLngToLayerPoint
    const scale = utils.getScale()
    bird.vx = bird.vy = 0
    const { x, y } = project(startLatLng)
    bird.x = x
    bird.y = y
    bird.scale.set(0.5 / scale)
    firstDraw = false
  }
  renderer.render(container)
}, app.stage)

//Put pixi overlay on map
pixiOverlay.addTo(mymap)

// Set up keyboard
setupKeyboard(bird)

// Start the game loop
PIXI.Ticker.shared.add(delta => gameLoop(delta))

//Update the current game state
function gameLoop(delta) {
  play(delta)
}

function play() {
  const previousX = bird.x
  const previousY = bird.y
  // Use the bird's velocity to make it move
  bird.x += bird.vx
  bird.y += bird.vy

  if (previousX != bird.x || previousY != bird.y) {
    // redraw pixi overlay
    pixiOverlay.redraw({ type: 'move' })
  }
}
