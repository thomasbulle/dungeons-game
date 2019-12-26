class Player {
  constructor(posX, posY, life, direction, coins = 0) {
    this.posX = posX;
    this.posY = posY;
    this.life = life;
    this.coins = coins;
    this.direction = direction;
    this.audioHit = new Audio('../ressources/sounds/hit.mp3');
  }

  move(x, y) {
    this.posX += x;
    this.posY += y;
    
    if (y > 0) {
      this.direction = 'right';
    } else if (y < 0) {
      this.direction = 'left';
    }
  }

  loseLife() {
    this.audioHit.play();
    this.life -= 1;
    document.getElementsByClassName('heart')[this.life].src = '../ressources/images/heart-dead.png';
    // Game Over
    if (this.life === 0) {
      document.getElementById('modalGameOver').style.display = 'block';
    }
  }
}

export default Player;
