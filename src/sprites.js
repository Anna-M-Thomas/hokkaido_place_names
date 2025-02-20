import { Assets, Sprite, Text} from 'pixi.js'
import cityData from '../city_data.json'

class Sprites {
    constructor(container){
        this.container = container;
        this.bird = null;
        this.cities = [];
    }

    async initialize(){
        await this.createBird();
        await this.createCities();
    }

    async createBird(){
        const birdTexture = await Assets.load('img/bird_hato.png')
        const bird = Sprite.from(birdTexture)
        bird.anchor.set(0.5, 0.5)
        bird.zIndex = 1
        this.container.addChild(bird)
        this.bird = bird
    }

    async createCities(){
        cityData.forEach(city => {
          const cityText = new Text(city.city_name)
          cityText.anchor.set(0.5, 0.5)
          cityText.data = city
          cityText.interactive = true
          cityText.cursor = 'pointer';
          function onClick(){
            console.log("'clicked!")
          }
          cityText.on('pointerdown', onClick)
          this.container.addChild(cityText)
          this.cities.push(cityText)
        })
    }
}

export { Sprites }