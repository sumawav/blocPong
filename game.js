// blocPONG
// Like pong but hella better
//
// Souma Mondal

//

var PI = Math.PI;


window.addEventListener("load", function() {
  Game.initialize("game", startGame);
});

var startGame = function() {
  Game.setBoard(0, new Banner("blocPONG",
                                   "Press <space> to RAGE",
                                   true,
                                   playGame));
};

var playGame = function() {
  var gameBoard = new GameBoard();
  gameBoard.add( new Player(true) );
  gameBoard.add( new Computer(false) );
  gameBoard.add( new Ball() );
  Game.setBoard(1, gameBoard);
};

var Player = function(clear) {
  this.w = 100;
  this.h = 20;
  this.x = Game.width/2 - this.w / 2;
  this.y = Game.height - 10 - this.h;
  this.maxVel = 200;
  this.clear = clear;
};

Player.prototype = new Paddle();
Player.prototype.step = function(dt) {
  if(Game.keys["left"]) {
    this.vx = -this.maxVel;
  } else if(Game.keys["right"]) {
    this.vx = this.maxVel;
  } else {
    this.vx = 0;
  }
  this.x += this.vx * dt;

  if(this.x < 0) {
    this.x = 0;
  } else if(this.x > Game.width - this.w) {
    this.x = Game.width - this.w;
  }
};

var Computer = function(clear) {
  this.w = 100;
  this.h = 20;
  this.x = Game.width/2 - this.w / 2;
  this.y = 10;
  this.maxVel = 200;
  this.clear = clear;
};

Computer.prototype = new Paddle();
Computer.prototype.step = function() { };

var Ball = function() {
  this.x = Game.width / 2;
  this.y = Game.height / 2;
  this.radius = 5;
  this.v = 10;
  this.radian = PI/4;
};

Ball.prototype.step = function(dt) {
  var d = this.v * dt;
  this.x += d * Math.cos(this.radian);
  this.y += d * Math.sin(this.radian);
};

Ball.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
  ctx.strokeStyle = "#00FF00";
  ctx.stroke();
  ctx.fillStyle = "#00FF00";
  ctx.fill();
  ctx.closePath();
};
