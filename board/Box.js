import { getBoxColor, drawImg } from '../helpers/draw.js';

class Box {
  constructor(width, height, type) {
    this.width = width;
    this.height = height;
    this.type = type;
  }

  draw(ctx, coefX, coefY) {
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.fillStyle = getBoxColor(this.type);
    ctx.fillRect(coefX * this.width, coefY * this.height, this.width, this.height);
    ctx.strokeRect(coefX * this.width, coefY * this.height, this.width, this.height);
    /road|player|wall/g.test(this.type) && drawImg(ctx, coefX, coefY, this.type);
  }
}

export default Box;
