class Player {
  constructor(posX, posY, life, xDirection, coins = 0) {
    this.posX = posX;
    this.posY = posY;
    this.life = life;
    this.coins = coins;
    this.xDirection = xDirection;
  }

  move(x, y) {
    this.posX += x;
    this.posY += y;
    
    if (x > 0) {
      this.xDirection = 'right';
    } else if (x < 0) {
      this.xDirection = 'left';
    }
  }
}

export default Player;
