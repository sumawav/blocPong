// blocPONG
// Like pong but hella better
//
// Souma Mondal

//
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
  gameBoard.add( new Player(false) );
  gameBoard.add( new Computer(false) );
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
