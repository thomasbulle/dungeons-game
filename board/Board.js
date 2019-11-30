import Box from './Box.js';
import Monster from '../entities/Monster.js';
import config from '../config/config.js';
import levels from './levels.js';

class Board {
  constructor(width, height, level) {
    this.width = width;
    this.height = height;
    this.posPlayerX = levels[level].player.x;
    this.posPlayerY = levels[level].player.y;
    this.level = level;
    this.board = new Array(width);
    this.monsters = new Array(levels[this.level].monsters.length);

    this.initBoard();
  }

  initBoard() {
    for (let i = 0; i < this.width; i++) {
      const column = [];
      for (let j = 0; j < this.height; j++) {
        column.push(new Box(config.board.square.width, config.board.square.height, 'road'));
      }
      this.board[i] = column;
    }

    // place the walls
    levels[this.level].walls.map(wall => this.board[wall.x][wall.y].type = 'wall');

    // place the monsters
    levels[this.level].monsters.map((monster, index) => {
      this.board[monster.x][monster.y].type = 'monster';
      this.monsters[index] = new Monster(monster.x, monster.y);
    });

    // init player
    const posPlayerX = levels[this.level].player.x;
    const posPlayerY = levels[this.level].player.y;
    this.board[posPlayerX][posPlayerY].type = 'player';
  }

  draw(ctx) {
    this.board.map((column, indexColumn) => {
      column.map((box, indexBox) => {
        box.draw(ctx, indexColumn, indexBox);
      });
    });

    this.monsters.map(monster => monster.draw(ctx));
  }
}

export default Board;
