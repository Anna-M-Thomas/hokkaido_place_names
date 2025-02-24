import Alpine from 'alpinejs'
import { Health, Score } from './health.js'

Alpine.store('UI', {
  questionWindow: false,
  resultWindow: false,
  pixiOverlay: null,
  city: null,
  name: '',
  pron: '',
  answer: '',
  correct: false,
  totalCorrect: 0,
  score: new Score(0),
  health: new Health(10),
  checkAnswer() {
    this.correct = false
    this.questionWindow = false
    if (this.answer == this.pron) {
      this.correct = true
      this.totalCorrect++
      this.score.increment()
      this.health.increment()
      this.pixiOverlay.redraw({ type: 'correct_city', city: this.city })
    } else {
      this.health.decrement()
    }
    this.answer = ''
    this.resultWindow = true
  },
  askQuestion(city, pixiOverlay) {
    this.pixiOverlay = pixiOverlay
    this.questionWindow = true
    // index.html, store.jsで書きやすくしたいためcityと別途に名前と読み方も保存
    this.city = city
    this.name = city.data.city_name
    this.pron = city.data.pron
  },
})

Alpine.start()
