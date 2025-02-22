import Alpine from 'alpinejs'
import { Health, Score } from './health.js'

Alpine.store('UI', {
  questionWindow: false,
  resultWindow: false,
  cityName: '',
  cityPron: '',
  answer: '',
  correct: false,
  score:  new Score(0),
  health: new Health(10),
  checkAnswer() {
    this.correct = false
    this.questionWindow = false
    if (this.answer == this.cityPron) {
      this.correct = true
      this.score.increment()
      this.health.increment()
    } else {
      this.health.decrement()
    }
    this.answer = ''
    this.resultWindow = true
  },
  askQuestion(name, pron) {
    this.questionWindow = true
    this.cityName = name
    this.cityPron = pron
  },
})

Alpine.start()
