import config from '../config/config.js';
import { getRandomMonster } from '../helpers/entities.js';
import { drawImg } from '../helpers/draw.js';

class Monster {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.monsterType = getRandomMonster(config.monster.numberOfTypes);
  }

  draw(ctx) {
    drawImg(ctx, this.posX, this.posY, this.monsterType);
  }
}

export default Monster;
