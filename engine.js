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

  var KEY_CODES = { 37: "left", 39: "right", 32: "space",
                    90: "cleft", 88: "cright"};
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
    var idx = this.removed.indexOf(obj);
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
    for(var i = 0, len = this.objects.length; i < len; ++i) {
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

  this.overlap = function(o1, o2) {
    return !( (o1.y + o1.h - 1 < o2.y) ||
              (o2.y + o2.h - 1 < o1.y) ||
              (o1.x + o1.w - 1 < o2.x) ||
              (o2.x + o2.w - 1 < o1.x) );
  };

  this.bounce = function(ball, paddle) {
    return !( (ball.x + ball.w < paddle.x) ||
              (paddle.x + paddle.w < ball.x) );
  };

  this.bounceAngle = function(ball, paddle, type) {
    // eventually, I want this thing to adjust the ngle of reflection
    // based on where along the paddle the ball makes contact
    // for now a simple reflection will suffice
    //ball.vy *= -1;
    var magnitude = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);

    // this next bit caused me to tear out some hair
    // http://hyperphysics.phy-astr.gsu.edu/hbase/ttrig.html#c3
    // basically, F**k atan...
    var angleIn = Math.atan(ball.vy / ball.vx);
    if (ball.vx < 0 ) {
      angleIn += PI;
    } else if (ball.vx > 0 || ball.vy < 0) {
      angleIn += 2*PI;
    }

    var angleOut = 2*PI - angleIn;
    var angleAdjust = ball.x + ball.radius - paddle.x - (paddle.w / 2);
    angleAdjust /= (paddle.w / 2);

    if (type === OBJECT_PLAYER) {
      angleOut += angleAdjust * ANGLE_SCALE_FACTOR;
    } else if (type === OBJECT_COMPUTER) {
      angleOut -= angleAdjust * ANGLE_SCALE_FACTOR;
    }

    while (angleOut < 0) {
      angleOut += 2*PI;
    }

    angleOut %= 2*PI;

    console.log("angleOut: " + angleOut * 180 / PI);

    ball.vx = magnitude * Math.cos(angleOut);
    ball.vy = magnitude * Math.sin(angleOut);
  };

  this.collide = function(obj, type) {
    return this.detect(function() {
      if(obj !== this) {
        var col = (!type || this.type & type) && board.overlap(obj, this);
        return col ? this : false;
      }
    });
  };

  this.reflect = function(obj, type) {
    return this.detect(function() {
      if(obj !== this) {
        var col = (!type || this.type & type) && board.bounce(obj, this);
        return col ? this : false;
      }
    });
  };

};

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
