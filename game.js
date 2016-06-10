// blocPONG
// Like pong but hella better
//
// Souma Mondal

//
window.addEventListener("load", function() {
  Game.initialize("game", startGame);
});

var startGame = function() {
  Game.setBoard(0, new TitleScreen("blocPONG",
                                   "Press <space> to RAGE",
                                   true,
                                   playGame));
};

var playGame = function() {
  var gameBoard = new GameBoard();
  gameBoard.add( new Paddle(20, 100, 200, true) );
  Game.setBoard(0, gameBoard);
};

var Paddle = function(height, width, maxVel, clear) {
  this.w = width;
  this.h = height;
  this.x = Game.width/2 - this.w / 2;
  // this.y = Game.height - this.h;
  this.y = Game.height - 10 - this.h;
  this.maxVel = maxVel;
  this.clear = clear;
};

Paddle.prototype.step = function(dt) {
  if(Game.keys["left"]) {
    this.vx = -this.maxVel;
  } else if(Game.keys["right"]) {
    this.vx = this.maxVel;
  } else {
    this.vx = 0;
  }
  this.x += this.vx * dt;
};

Paddle.prototype.draw = function(ctx) {

  if (this.clear) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,Game.width,Game.height);
  }
  ctx.beginPath();
  ctx.rect(this.x, this.y, this.w, this.h);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#00FF00";
  ctx.stroke();
  ctx.fillStyle = "#00FF00";
  ctx.fill();
  ctx.closePath();
  ctx.lineWidth = 1;
};
