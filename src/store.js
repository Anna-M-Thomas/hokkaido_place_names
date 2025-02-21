import Alpine from 'alpinejs'

Alpine.store('UI', {
  questionWindow: false,
  resultWindow: false,
  cityName: '',
  cityPron: '',
  answer: '',
  correct: false,
  score: null,
  health: null,
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
