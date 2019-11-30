class Player {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
  }

  move(x, y) {
    this.posX += x;
    this.posY += y;
  }
}

export default Player;
