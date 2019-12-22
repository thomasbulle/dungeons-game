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
  //document.getElementById('skipLevel').onclick = () => document.getElementById('modalEndGame').style.display = 'block';

  document.addEventListener('keydown', event => {
    /^Arrow(Up|Down|Left|Right)$/g.test(event.key) && event.preventDefault();
    board.controls(ctx, event.key);
  });
  board.drawStats();

  // set phone controller
  document.getElementById('upButton').onclick = () => board.controls(ctx, 'ArrowUp');
  document.getElementById('downButton').onclick = () => board.controls(ctx, 'ArrowDown');
  document.getElementById('leftButton').onclick = () => board.controls(ctx, 'ArrowLeft');
  document.getElementById('rightButton').onclick = () => board.controls(ctx, 'ArrowRight');
};

const drawBoard = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.draw(ctx);
  requestAnimationFrame(drawBoard);
}

window.onload = init;
