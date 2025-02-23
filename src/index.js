import * as L from 'leaflet'
import { Application, Ticker, Assets, Sprite } from 'pixi.js'
import 'leaflet-pixi-overlay'
import { setupKeyboard } from './setupKeyboard.js'
import { Sprites } from './sprites.js'
import './store.js'
import Alpine from 'alpinejs'
import coolBirdImage from './img/cool_bird_hato.png'
import discoBallImage from './img/mirror_ball.png'

// 岩見沢市の位置(?)
const startLatLng = [43.11, 141.45]
// Number of cities in Hokkaido 
const numberOfCities = 1 // 35 + 129 + 15 = 179
//　Making the map
const mymap = L.map('mapid', { doubleClickZoom: false, keyboard: false }).setView(startLatLng, 11)
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

// Making pixi overlay
// There's an option called "showRedrawOnMove" that redraws the pixi layer if the map moves
// I'm not using because I want redraw to trigger when the bird moves, and the map to follow the bird
const pixiOverlay = L.pixiOverlay(async function (utils, event) {
  const container = utils.getContainer()
  const renderer = utils.getRenderer()
  const project = utils.latLngToLayerPoint
  const map = utils.getMap()
  const scale = utils.getScale()

  // "camera" (map) moves if player moves
  if (event.type == 'move') {
    const newCoords = utils.layerPointToLatLng([bird.x, bird.y])
    map.panTo(newCoords)
  }

  // Change city's color and remove interactivity when it was correctly answered
  if(event.type == 'correct_city'){
    event.city.style.fill = "#87CEEB"
    event.city.interactive = false
  }

  if(event.type == 'add_disco_ball'){
    const bounds = map.getBounds();
    const center = bounds.getCenter();
    const discoBallTexture = await Assets.load(discoBallImage)
    const ball  = Sprite.from(discoBallTexture)
    ball.anchor.set(0.5, 0.5)
    container.addChild(ball);
    const { x, y } = project([bounds.getNorth() - .04, center.lng]);
    ball.x = x
    ball.y = y
    ball.scale.set(0.5 / scale)
  }

  if(event.type == 'happy_disco'){
    // cycle background colors
    // zoom map in and out
    // bird walks back and forth
    renderer.background.color = "rgba(148, 0, 211, 0.4)"
  }

  // Place bird and city names on map
  if (firstDraw) {
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
const keys = setupKeyboard(sprites.bird)

// Event listeners for each city
// Changing text color, content, etc does not work correctly without calling pixiOverlay redraw
cities.forEach(city => {
  city.on('pointerdown', (event) => Alpine.store('UI').askQuestion(event.target, pixiOverlay))
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

  if(Alpine.store('UI').health.isNegativeHealth()){
    pixiOverlay.destroy();
  }

  // win!
  if(Alpine.store('UI').totalCorrect == numberOfCities){
    Alpine.store('UI').totalCorrect = 0
    getReadyForHappyDiscoMode()
    happyDiscoMode()
  }

  if (previousX != bird.x || previousY != bird.y) {
    // Redraw pixi overlay and move map if bird moved
    pixiOverlay.redraw({ type: 'move' })
  }
}

async function getReadyForHappyDiscoMode(){
  Alpine.store('UI').resultWindow = false
  keys.unsubscribeAll();
 
  pixiOverlay.redraw({ type: "add_disco_ball" });
  const coolBirdTexture = await Assets.load(coolBirdImage)
  bird.texture = coolBirdTexture;
  pixiOverlay.redraw({});
}

function happyDiscoMode(){
  pixiOverlay.redraw({ type: "happy_disco" });
}
