class Player {
  constructor(posX, posY, life) {
    this.posX = posX;
    this.posY = posY;
    this.life = life;
  }

  move(x, y) {
    this.posX += x;
    this.posY += y;
  }
}

export default Player;
