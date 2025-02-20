import * as L from 'leaflet'
import { Application, Ticker } from 'pixi.js'
import 'leaflet-pixi-overlay'
import { setupKeyboard } from './keyboard'
import { Sprites } from './sprites.js'

const startLatLng = [43.11, 141.45]

//Making the map
const mymap = L.map('mapid').setView(startLatLng, 11)
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

// Make pixi app, add stuff
const app = new Application()
let firstDraw = true
app.stage.sortableChildren = true

const sprites = new Sprites(app.stage)
await sprites.initialize()
const bird = sprites.bird
const cities = sprites.cities

// Making pixi overlay from stage
const pixiOverlay = L.pixiOverlay(function (utils, event) {
  const container = utils.getContainer()
  const renderer = utils.getRenderer()

  // "camera" (map) moves if player moves
  if (event.type == 'move') {
    const map = utils.getMap()
    const newCoords = utils.layerPointToLatLng([bird.x, bird.y])
    map.panTo(newCoords)
  }

  // Place bird and city names on map
  if (firstDraw) {
    const project = utils.latLngToLayerPoint
    const scale = utils.getScale()
    bird.vx = bird.vy = 0
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
  renderer.render(container)
}, app.stage)

//Put pixi overlay on map
pixiOverlay.addTo(mymap)

// Set up keyboard
setupKeyboard(sprites.bird)

// Start the game loop
Ticker.shared.add(delta => gameLoop(delta))

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
    // Redraw pixi overlay if moved
    pixiOverlay.redraw({ type: 'move' })
  }
}
