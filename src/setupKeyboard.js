import { keyboard } from "./libraries/keyboard.js"

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

  function unsubscribeAll() {
    left.unsubscribe();
    up.unsubscribe();
    right.unsubscribe();
    down.unsubscribe();
  }

  return { unsubscribeAll }
}

export { setupKeyboard } 
