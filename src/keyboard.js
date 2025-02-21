// github.com/kittykatattack/learningPixi?tab=readme-ov-file#keyboard-movement
function keyboard(value) {
  const key = {}
  key.value = value
  key.isDown = false
  key.isUp = true
  key.press = undefined
  key.release = undefined
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) {
        key.press()
      }
      key.isDown = true
      key.isUp = false
      event.preventDefault()
    }
  }

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) {
        key.release()
      }
      key.isDown = false
      key.isUp = true
      event.preventDefault()
    }
  }

  //Attach event listeners
  const downListener = key.downHandler.bind(key)
  const upListener = key.upHandler.bind(key)

  window.addEventListener('keydown', downListener, false)
  window.addEventListener('keyup', upListener, false)

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener)
    window.removeEventListener('keyup', upListener)
  }

  return key
}

function setupKeyboard(sprite) {
  const left = keyboard('ArrowLeft')
  const right = keyboard('ArrowRight')
  const up = keyboard('ArrowUp')
  const down = keyboard('ArrowDown')

  const speed = 1.5

  function stopMovingHorizontal() {
    sprite.vx = 0;
  }

  function stopMovingVertical(){
    sprite.vy = 0;
  }

  left.press = () => {
    sprite.vx = -speed
    sprite.anchor.x = .5;
    if(sprite.scale.x < 0) sprite.scale.x *= -1
  }

  right.press = () => {
    sprite.vx = speed
    sprite.anchor.x = .5;
    if(sprite.scale.x > 0) sprite.scale.x *= -1
  }

  up.press = () => {
    sprite.vy = -speed
  }

  down.press = () => {
    sprite.vy = speed
  }
  
  left.release = right.release = stopMovingHorizontal;
  up.release = down.release = stopMovingVertical;
}

export { setupKeyboard }
