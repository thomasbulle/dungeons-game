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

    // place the coins
    levels[this.level].coins.map(coin => this.board[coin.x][coin.y].type = 'coin');

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

    // init the player's life
    this.player.life = levels[this.level].player.life;
  }

  drawHearts() {
    // draw the life counter
    const lifeWrapper = document.getElementById('lifeWrapper');
    let hearts = new Array(this.player.life);
    for(let i=0; i < this.player.life; i++) {
      const el = document.createElement('img');
      el.src = '../ressources/images/heart.png';
      el.alt = 'Heart';
      el.className = 'heart';
      lifeWrapper.appendChild(el);
      hearts.push(el);
    }
  }

  drawCoins() {
    // draw the coin counter
    const coinCounterWrapper = document.getElementById('coinCounterWrapper');
    let coins = new Array(levels[this.level].coins.length);
    for(let i=0; i < levels[this.level].coins.length; i++) {
      const el = document.createElement('img');
      el.src = '../ressources/images/big-coin-empty.png';
      el.alt = 'Coin';
      el.className = 'coin';
      coinCounterWrapper.appendChild(el);
      coins.push(el);
    }
  }

  draw(ctx) {
    // draw the board
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
      if (/^road|coin$/g.test(this.board[posX + vx][posY + vy].type)) {
        if (this.board[posX + vx][posY + vy].type === 'coin') {
          const audio = new Audio('../ressources/sounds/get-coin.mp3');
          audio.play();
          this.player.coins += 1;
          document.getElementsByClassName('coin')[this.player.coins-1].src = '../ressources/images/big-coin.png';
        }
        this.board[posX + vx][posY + vy].type = 'player';
        this.board[posX][posY].type = 'road';
        this.player.move(vx, vy);
      } else if (this.board[posX + vx][posY + vy].type === 'monster') {
        const audio = new Audio('../ressources/sounds/hit.mp3');
        audio.play();
        document.getElementsByClassName('heart')[this.player.life-1].src = '../ressources/images/heart-dead.png';
        this.player.life -= 1;
        // Game Over
        if (this.player.life === 0) {
          document.getElementById('modal').style.display = 'block';
        }
      } else if (this.board[posX + vx][posY + vy].type === 'exit') {
        console.log('Exit');
      } else if (this.board[posX + vx][posY + vy].type === 'wall') {
        console.log('Obstacle');
      }
    } else {
      console.log('Board limit');
    }
  }
}

export default Board;
