import Box from './Box.js';
import Player from '../entities/Player.js';
import Monster from '../entities/Monster.js';
import config from '../config/config.js';
import levels from './levels.js';

class Board {
  constructor(width, height, level, callbackLevelChange) {
    this.width = width;
    this.height = height;
    this.posPlayerX = 0;
    this.posPlayerY = 0;
    this.level = level;
    this.board = new Array(width);
    this.monsters = null;
    this.player = null;
    this.audioGetCoin = new Audio('../ressources/sounds/get-coin.mp3');
    this.coinNumber = 1;
    this.callbackLevelChange = callbackLevelChange;

    this.initBoard();
  }

  initBoard() {
    this.posPlayerX = levels[this.level].player.x;
    this.posPlayerY = levels[this.level].player.y;
    this.monsters = new Array(levels[this.level].monsters.length);

    for (let i = 0; i < this.width; i++) {
      const column = [];
      for (let j = 0; j < this.height; j++) {
        column.push(new Box(config.board.square.width, config.board.square.height, 'road'));
      }
      this.board[i] = column;
    }

    // place the walls
    levels[this.level].walls.map(wall => this.board[wall.y][wall.x].type = 'wall');

    // place the coins
    levels[this.level].coins.map(coin => this.board[coin.y][coin.x].type = 'coin');

    // place the monsters
    levels[this.level].monsters.map((monster, index) => {
      this.board[monster.y][monster.x].type = 'monster';
      let vMonster = (!this.board[monster.y + 1] || /^wall|monster$/g.test(this.board[monster.y + 1][monster.x + 1].type)) ? -1 : 1;
      this.monsters[index] = new Monster(monster.x, monster.y, monster.hasMonsterArea, monster.movable, monster.movable === 'x' ? vMonster : 0, monster.movable === 'y' ? vMonster : 0);
    });

    // place the exit
    const exitX = levels[this.level].exit.x;
    const exitY = levels[this.level].exit.y;
    this.board[exitY][exitX].type = 'exit';

    // init player
    const posPlayerX = levels[this.level].player.x;
    const posPlayerY = levels[this.level].player.y;
    const direction = levels[this.level].player.direction;
    this.board[posPlayerY][posPlayerX].type = `player-${direction}`;
    const lifePlayer = levels[this.level].player.life;
    this.player = new Player(posPlayerX, posPlayerY, lifePlayer, direction);
  }

  drawStats() {
    if (this.level === 0) {
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

    const coinCounterWrapper = document.getElementById('coinCounterWrapper');

    // remove the prev coins
    coinCounterWrapper.innerHTML = '';

    // draw the coin counter
    let coins = new Array(levels[this.level].coins.length);
    for(let i=0; i < levels[this.level].coins.length; i++) {
      const el = document.createElement('img');
      el.src = '../ressources/images/big-coin-empty.png';
      el.alt = 'Coin';
      el.className = 'coin';
      coinCounterWrapper.appendChild(el);
      coins.push(el);
    }

    // display level number
    const levelInfo = document.getElementById('levelInfo');
    levelInfo.textContent = /\d/g.test(levelInfo.textContent)
      ? levelInfo.textContent.replace(/\d/g, (this.level + 1).toString())
      : `${levelInfo.textContent}${(this.level + 1).toString()}`;
  }

  draw(ctx) {
    // draw the board
    this.board.map((column, indexColumn) => {
      column.map((box, indexBox) => {
        box.draw(ctx, indexColumn, indexBox, this.coinNumber);
      });
    });

    this.monsters.map(monster => {
      monster.draw(ctx);

      // Set the monster zone
      if (monster.hasMonsterArea) {
        if (this.board[monster.posY + 1] && this.board[monster.posY + 1][monster.posX].type !== 'wall') {
          this.board[monster.posY + 1][monster.posX].type = 'monster'; 
        }
        if (this.board[monster.posY - 1] && this.board[monster.posY - 1][monster.posX].type !== 'wall') {
          this.board[monster.posY - 1][monster.posX].type = 'monster';
        }
        if (this.board[monster.posY][monster.posX + 1] && this.board[monster.posY][monster.posX + 1].type !== 'wall') {
          this.board[monster.posY][monster.posX + 1].type = 'monster';
        }
        if (this.board[monster.posY][monster.posX - 1] && this.board[monster.posY][monster.posX - 1].type !== 'wall') {
          this.board[monster.posY][monster.posX - 1].type = 'monster';
        }
      }
    });
  }

  controls(ctx, movement) {
    if (movement === 'ArrowLeft') {
      this.movePlayer(0, -1, ctx);
      return;
    }
    if (movement === 'ArrowUp') {
      this.movePlayer(-1, 0, ctx);
      return;
    }
    if (movement === 'ArrowRight') {
      this.movePlayer(0, 1, ctx);
      return;
    }
    if (movement === 'ArrowDown') {
      this.movePlayer(1, 0, ctx);
      return;
    }
  }

  movePlayer(vx, vy, ctx) {
    const { posX, posY } = this.player;

    if (this.board[posY + vy] && this.board[posY + vy][posX + vx]) {
      if (/^road|coin$/g.test(this.board[posY + vy][posX + vx].type)) {
        if (this.board[posY + vy][posX + vx].type === 'coin') {
          this.audioGetCoin.play();
          this.player.coins += 1;
          document.getElementsByClassName('coin')[this.player.coins-1].src = '../ressources/images/big-coin.png';
        }
        this.board[posY][posX].type = 'road';
        this.player.move(vx, vy);
        this.board[posY + vy][posX + vx].type = `player-${this.player.direction}`;
      } else if (this.board[posY + vy][posX + vx].type === 'monster') {
        this.player.loseLife();
      } else if (this.board[posY + vy][posX + vx].type === 'exit') {
        if (this.player.coins === levels[this.level].coins.length) {
          if (this.level + 1 === levels.length) {
            // End game
            document.getElementById('modalEndGame').style.display = 'block';
          } else {
            // Next level
            this.nextLevel(ctx);
          }
        } else {
          console.log('Missing coins !');
        }
      } else if (this.board[posY + vy][posX + vx].type === 'wall') {
        console.log('Obstacle');
      }
    } else {
      console.log('Board limit');
    }
  }

  moveMonster(ctx) {
    this.monsters.map(monster => {
      if (monster.movable) {
        if (this.board[monster.posY + monster.vy] && this.board[monster.posY + monster.vy][monster.posX + monster.vx]) {
          if (/^road|coin$/g.test(this.board[monster.posY + monster.vy][monster.posX + monster.vx].type)) {
            monster.move();
          } else if (/player/g.test(this.board[monster.posY + monster.vy][monster.posX + monster.vx].type)) {
            monster[`v${monster.movable}`] = Math.sign(monster[`v${monster.movable}`]) > 0 ? -1 : 1;
            monster.move();
            this.player.loseLife();
          } else if (/monster|wall/g.test(this.board[monster.posY + monster.vy][monster.posX + monster.vx].type)) {
            monster[`v${monster.movable}`] = Math.sign(monster[`v${monster.movable}`]) > 0 ? -1 : 1;
            monster.move();
          }
        } else {
          monster[`v${monster.movable}`] = Math.sign(monster[`v${monster.movable}`]) > 0 ? -1 : 1;
          monster.move();
        }
        monster.prevBoxType = monster.currentBoxType;
        monster.currentBoxType = this.board[monster.posY][monster.posX].type;
        this.board[monster.posY - monster.vy][monster.posX - monster.vx].type = monster.prevBoxType || 'road';
        this.board[monster.posY][monster.posX].type = 'monster';
      }
    });
  }

  nextLevel(ctx) {
    this.level++;
    this.initBoard();
    this.draw(ctx);
    this.drawStats();
    this.callbackLevelChange(this.level);
  }
}

export default Board;
