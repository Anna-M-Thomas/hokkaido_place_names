class Score {
  constructor(value) {
    this.value = value
  }

  increment() {
    this.value++
  }
}

class Health extends Score {
  decrement() {
    this.value--
  }
  isNegativeHealth() {
    return this.value < 0
  }
}

export { Score, Health }
