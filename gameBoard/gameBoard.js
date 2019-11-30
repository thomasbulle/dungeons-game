import Board from '../board/Board.js';
import config from '../config/config.js';
import Player from '../entities/Player.js';
import levels from '../board/levels.js';

let canvas = null;
let ctx = null;
let level = 0;
let board = null;
const posPlayerX = levels[level].player.x;
const posPlayerY = levels[level].player.y;
let player = null;

const init = () => {
  board = new Board(config.board.width, config.board.height, level);
  player = new Player(posPlayerX, posPlayerY);
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext("2d");
  canvas.width = 450;
  canvas.height = 450;
  requestAnimationFrame(drawBoard);
  controls();
};

const drawBoard = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.draw(ctx);
  requestAnimationFrame(drawBoard);
}

const controls = () => {
  document.addEventListener('keydown', event => {
    if (event.isComposing || event.keyCode === 37) {
      player.move(-1, 0);
      board.movePlayer(player.posX, player.posY, -1, 0, ctx);
      return;
    }
    if (event.isComposing || event.keyCode === 38) {
      player.move(0, -1);
      board.movePlayer(player.posX, player.posY, 0, -1, ctx);
      return;
    }
    if (event.isComposing || event.keyCode === 39) {
      player.move(1, 0);
      board.movePlayer(player.posX, player.posY, 1, 0, ctx);
      return;
    }
    if (event.isComposing || event.keyCode === 40) {
      player.move(0, 1);
      board.movePlayer(player.posX, player.posY, 0, 1, ctx);
      return;
    }
  });
}

window.onload = init;
