import Board from '../board/Board.js';
import config from '../config/config.js';

let canvas = null;
let ctx = null;
let level = 0;
let board = null;

const init = () => {
  board = new Board(config.board.width, config.board.height, level);
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext("2d");
  canvas.width = 450;
  canvas.height = 450;
  requestAnimationFrame(drawBoard);
  document.getElementById('skipLevel').onclick = () => board.nextLevel(ctx);
  board.controls(ctx);
  board.drawStats();
};

const drawBoard = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.draw(ctx);
  requestAnimationFrame(drawBoard);
}

window.onload = init;
