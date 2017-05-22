var ENEMY_INTERVAL = 1000;
var ENEMY_SPEED = 130;
var PLAYER_X = 200;
var PLAYER_Y = 400;
var PLAYER_SPEED = 5;
var ENEMY_X = 0;
var X_LENGTH = 60;
var Y_LENGTH = 40;
var INITIAL_ENEMIES_NUM = 4;
var starNum = 4;

var score = 0;  // 吃到的星星数

var shouldShowSelector = false; // 吃到所有的星星时设为 true

var finished = false; // 胜利时设为 true

// 这是我们的玩家要躲避的敌人
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    this.x =  ENEMY_X; // rd(0,400);
    this.y = rd(0,350);
    this.speed = ENEMY_SPEED;
    
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

var Star = function() {
    this.x =  rd(0,400);
    this.y = rd(0,350);
    
    this.sprite = 'images/Star.png';
};

var Selector = function() {
    this.x =  rd(0,400);
    this.y = -50;
    
    this.sprite = 'images/Selector.png';
};

    

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    
    this.x += this.speed * dt;
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Selector.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数

var Player = function() {
  this.x = PLAYER_X;
  this.y = PLAYER_Y;
  this.speed = PLAYER_SPEED;
  
  
  this.status = "stop";
  
  this.sprite = "images/char-boy.png";
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
Player.prototype.update = function() {
  switch(this.status) {
    case "left":
      if (this.x > 0) {
        this.x -= this.speed;
      }
      break;
    case "right":
      if (this.x < canvas.width - 100) {
      this.x += this.speed;
      }
      break;
    case "up":
      if (this.y > -20) {
      this.y -= this.speed;
      }
      break;
    case "down":
      if (this.y < canvas.height - 170) {
        this.y += this.speed;
      }
      break;
  }
  
  
  // 和 enemy, star, selector 碰撞检测
  for (var a in allEnemies) {
    if (hitTest(player, allEnemies[a])) {
      player.x =  PLAYER_X;
      player.y =  PLAYER_Y;
    }
  }
  
  for (var i = starNum - 1; i >= 0; i--) {
    if (hitTest(player, allStars[i])) {
      score++;
      allStars.splice(i, 1);
      starNum--;
      
      if (starNum === 0) {
        showSelector();
      }
    }
  }
  
  finished = shouldShowSelector && hitTest(player, selector);
  
};

var showSelector = function() {
  selector = new Selector();
  
  shouldShowSelector = true;
};

var hitTest = function(player, enemy, xBias = 0, yBias = 0) {
  if (Math.abs(player.x - enemy.x - xBias) < X_LENGTH && Math.abs(player.y - enemy.y - yBias) < Y_LENGTH) {
    return true;
  } else {
    return false;
  }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
  this.status = key;
};

Player.prototype.resetSpeed = function(key) {
  if (this.status == key) {
    this.status = "stop";
  }
};


var player = new Player();
var allEnemies = [];
var allStars = [];

for (var i = 0; i < INITIAL_ENEMIES_NUM; i++) {
  allEnemies[i] = new Enemy();
}

for (var i = 0; i < starNum; i++) {
  allStars[i] = new Star();
}

var addEnemy = function() {
  allEnemies.push(new Enemy());
}

// 隔一段时间添加一个 enemy
setInterval(addEnemy, ENEMY_INTERVAL);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.resetSpeed(allowedKeys[e.keyCode]);
});


// 生成 [n, m) 的随机数
function rd(n,m){
  var c = m-n+1;
  return Math.floor(Math.random() * c + n);
}