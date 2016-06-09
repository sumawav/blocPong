var Game = (function() {
  var boards = [];

  this.initialize = function(canvasElementId, callback) {
    this.canvas = document.getElementById(canvasElementId);
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if(!this.ctx) {
      return alert("Please upgrade your browser to play");
    }

    this.setupInput();

    this.loop();

    callback();
  };

  var KEY_CODES = { 37: "left", 39: "right", 32: "select" };
  this.keys = {};

  this.setupInput = function() {
    window.addEventListener("keydown", function(e) {
      if(KEY_CODES[e.keycode]) {
        Game.keys[KEY_CODES[e.keycode]] = true;
        e.preventDefault();
      }
    }, false);

    window.addEventListener("keyup", function(e) {
      if(KEY_CODES[e.keycode]) {
        Game.keys[KEY_CODES[e.keycode]] = false;
        e.preventDefault();
      }
    }, false);
  };

  this.loop = function() {
    var dt = 30 / 1000;
    setTimeout(Game.loop,30);

    for(var i=0,len = boards.length;i<len;i++) {
      if(boards[i]) {
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }

  };

  this.setBoard = function(num, board) {
    boards[num] = board;
  };

  return this;
})();
