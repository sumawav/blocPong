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

  var KEY_CODES = { 37: "left", 39: "right", 32: "space" };
  this.keys = {};

  this.setupInput = function() {
    window.addEventListener("keydown", function(e) {
      if(KEY_CODES[e.keyCode]) {
        Game.keys[KEY_CODES[e.keyCode]] = true;
        e.preventDefault();
      }
    }, false);

    window.addEventListener("keyup", function(e) {
      if(KEY_CODES[e.keyCode]) {
        Game.keys[KEY_CODES[e.keyCode]] = false;
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

var Banner = function Banner(title, subtitle, clear, callback) {
  var up = false;

  this.step = function(dt) {
    if(!Game.keys['space']) {
      up = true;
    }
    if (up && Game.keys['space'] && callback) {
      callback();
    }
  };

  this.draw = function(ctx) {
    if(clear) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0,0,Game.width,Game.height);
    }
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";

    ctx.font = "bold 40px bangers";
    ctx.fillText(title, Game.width/2, Game.height/2);

    ctx.font = "bold 20px bangers";
    ctx.fillText(subtitle, Game.width/2, Game.height/2 + 40);
  };
};

var GameBoard = function() {
  var board = this;

  this.objects = [];
  this.cnt = {};

  this.add = function(obj) {
    obj.board = this;
    this.objects.push(obj);
    this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
    return obj;
  };

  this.remove = function(obj) {
    var idx = this.remove.indexOf(obj);
    if(idx === -1) {
      this.removed.push(obj);
      return true;
    } else {
      return false;
    }
  };

  this.resetRemoved = function() {
    this.removed = [];
  };

  this.finalizeRemoved = function() {
    for(var i = 0, len = this.removed.length; i < len; ++i) {
      var idx = this.objects.indexOf(this.removed[i]);
      if(idx !== -1) {
        this.cnt[this.removed[i].type]--;
        this.objects.splice(idx, 1);
      }
    }
  };

  // Call the same method on all current objects
  this.iterate = function(funcName) {
    var args = Array.prototype.slice.call(arguments, 1);
    for(var i = 0, len = this.objects.length; i < len; ++i) {
      var obj = this.objects[i];
      obj[funcName].apply(obj, args);
    }
  };

  // find the first object for which func is true
  // otherwise return false
  this.detect = function(func) {
    for(var i = 0, val = null, len = this.objects.length; i < len; ++i) {
      if( func.call(this.objects[i]) ) {
        return this.objects[i];
      }
    }
    return false;
  };

  this.step = function(dt) {
    this.resetRemoved();
    this.iterate('step', dt);
    this.finalizeRemoved();
  };

  this.draw = function(ctx) {
    this.iterate('draw', ctx);
  };

}

var Paddle = function() { };

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
