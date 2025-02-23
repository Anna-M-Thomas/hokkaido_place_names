import { Assets, Sprite, Text } from 'pixi.js'
import cityData from '../city_data.json'
import birdImage from './img/bird_hato.png'
import coolBirdImage from './img/cool_bird_hato.png'
import discoBallImage from './img/mirror_ball.png'
 
async function createBird(container){
    const birdTexture = await Assets.load(birdImage)
    const bird = Sprite.from(birdTexture)
    bird.anchor.set(0.5, 0.5)
    bird.vx = bird.vy = 0
    bird.zIndex = 1
    container.addChild(bird)
    bird.enterCoolMode = async function() {
        const coolBirdTexture = await Assets.load(coolBirdImage)
        this.texture = coolBirdTexture;
    }
    return bird
}

async function createCities(container){
    const cities = []
    cityData.forEach(city => {
        const cityText = new Text(city.city_name)
        cityText.anchor.set(0.5, 0.5)
        cityText.data = city
        cityText.interactive = true
        cityText.cursor = 'pointer'
        container.addChild(cityText)
        cities.push(cityText)
    })
    return cities
}

async function createDiscoBall(container){
    const discoBallTexture = await Assets.load(discoBallImage)
    const ball  = Sprite.from(discoBallTexture)
    ball.anchor.set(0.5, 0.5)
    container.addChild(ball);
    return ball
}

export { createBird, createCities, createDiscoBall }