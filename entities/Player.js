class Player {
  constructor(posX, posY, life, direction, coins = 0) {
    this.posX = posX;
    this.posY = posY;
    this.life = life;
    this.coins = coins;
    this.direction = direction;
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
}

export default Player;
