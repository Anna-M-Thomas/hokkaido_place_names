class ColorHelper {
    colors = [
        "rgba(148, 0, 211, 0.4)", // Violet
        "rgba(75, 0, 130, 0.4)", // Indigo
        "rgba(0, 0, 255, 0.4)", // Blue
        "rgba(0, 255, 0, 0.4)", // Green
        "rgba(255, 255, 0, 0.4)", // Yellow
        "rgba(255, 127, 0, 0.4)", // Orange
        "rgba(255, 0, 0, 0.4)", // Red
    ]
    currentIndex = 0

    getNextColor(){
        const currentColor = this.colors[this.currentIndex % this.colors.length]
        this.currentIndex++
        return currentColor
    }
}

export { ColorHelper }