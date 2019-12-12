class Player {
  constructor(posX, posY, life, coins = 0) {
    this.posX = posX;
    this.posY = posY;
    this.life = life;
    this.coins = coins;
  }

  move(x, y) {
    this.posX += x;
    this.posY += y;
  }
}

export default Player;
