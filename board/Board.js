import Box from './Box.js';
import Player from '../entities/Player.js';
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
    this.player = null;

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

    // place the exit
    const exitX = levels[this.level].exit.x;
    const exitY = levels[this.level].exit.y;
    this.board[exitX][exitY].type = 'exit';

    // init player
    const posPlayerX = levels[this.level].player.x;
    const posPlayerY = levels[this.level].player.y;
    this.board[posPlayerX][posPlayerY].type = 'player';
    this.player = new Player(posPlayerX, posPlayerY);
  }

  draw(ctx) {
    this.board.map((column, indexColumn) => {
      column.map((box, indexBox) => {
        box.draw(ctx, indexColumn, indexBox);
      });
    });

    this.monsters.map(monster => {
      monster.draw(ctx);

      // Set the monster zone
      if (this.board[monster.posX + 1] && this.board[monster.posX + 1][monster.posY].type !== 'wall') {
        this.board[monster.posX + 1][monster.posY].type = 'monster'; 
      }
      if (this.board[monster.posX - 1] && this.board[monster.posX - 1][monster.posY].type !== 'wall') {
        this.board[monster.posX - 1][monster.posY].type = 'monster';
      }
      if (this.board[monster.posX][monster.posY + 1] && this.board[monster.posX][monster.posY + 1].type !== 'wall') {
        this.board[monster.posX][monster.posY + 1].type = 'monster';
      }
      if (this.board[monster.posX][monster.posY - 1] && this.board[monster.posX][monster.posY - 1].type !== 'wall') {
        this.board[monster.posX][monster.posY - 1].type = 'monster';
      }
    });
  }

  controls(ctx) {
    document.addEventListener('keydown', event => {
      if (event.isComposing || event.keyCode === 37) {
        this.movePlayer(-1, 0, ctx);
        return;
      }
      if (event.isComposing || event.keyCode === 38) {
        this.movePlayer(0, -1, ctx);
        return;
      }
      if (event.isComposing || event.keyCode === 39) {
        this.movePlayer(1, 0, ctx);
        return;
      }
      if (event.isComposing || event.keyCode === 40) {
        this.movePlayer(0, 1, ctx);
        return;
      }
    });
  }

  movePlayer(vx, vy, ctx) {
    const { posX, posY } = this.player;

    if (this.board[posX + vx] && this.board[posX + vx][posY + vy]) {
      if (this.board[posX + vx][posY + vy].type === 'road') {
        this.board[posX + vx][posY + vy].type = 'player';
        this.board[posX][posY].type = 'road';
        this.player.move(vx, vy);
      } else if (this.board[posX + vx][posY + vy].type === 'monster') {
        console.log('Monster');
      } else if (this.board[posX + vx][posY + vy].type === 'exit') {
        console.log('Exit');
      } else {
        console.log('Obstacle');
      }
    } else {
      console.log('Board limit');
    }
  }
}

export default Board;
