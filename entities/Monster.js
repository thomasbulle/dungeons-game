import config from '../config/config.js';
import { getRandomMonster } from '../helpers/entities.js';
import { drawImg } from '../helpers/draw.js';

class Monster {
  constructor(posX, posY, hasMonsterArea, movable = null, v = 0) {
    this.posX = posX;
    this.posY = posY;
    this.hasMonsterArea = hasMonsterArea;
    this.monsterType = getRandomMonster(config.monster.numberOfTypes);
    this.movable = movable;
    this.v = v;
  }

  draw(ctx) {
    drawImg(ctx, this.posX, this.posY, this.monsterType);
  }

  move() {
    this.posX += this.v;
  }
}

export default Monster;
