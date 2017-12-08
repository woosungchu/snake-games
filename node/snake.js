window.onload = function WindowLoad(event) {
	main();
}

var container,game;
var UP=0, DOWN=1, LEFT=2, RIGHT=3, SCALE=10; 
var pixelSize = 10;
var limitH = 78; 
var limitW = 66;

function main(){
	console.log('main');
	container = document.getElementById('container');
	game = new Game(container);
}

Game = function(container){
	this.container = container;
	this.snake = null;
	this.cherry = null;
	
	this.keyHandler = new KeyHandler(this);
//	this.timer = new Timer(20);
	this.ticks =0;
	this.score = 0;
//	this.time = 0;
	this.over = false;
	this.paused = false;
	this.speed = 4/10;
	this.interval = null;
	
	this.run = function(){
		if(!this.over && !this.paused){
			this.ticks++;
			this.snake.move(this);
			this.render();
		}
	};
	
	this.render = function(){
		while (this.container.firstChild) {
			this.container.removeChild(this.container.firstChild);
		}
		
		this.snake && this.snake.draw();
		this.cherry && this.cherry.draw();
	};
	
	(function start(game){
		game.snake = new Snake(game.container);
		game.cherry = new Cherry(game.container);
		game.interval = setInterval(game.run.bind(game),game.speed * 100);
	})(this);
	
}

Snake = function(container){
	this.container = container;
	this.snakeParts = [];
	this.direction = DOWN;
	this.tailLength = 10;
	this.head = new Point(0,0);
	
	
	this.move = function(game){
		if (game && game.ticks % 2 == 0 && this.head!=null&&!game.over&&!game.paused) {
			
			this.snakeParts.push(new Point(this.head.x, this.head.y));
			// start
			if (this.direction == UP){
				if(this.head.y -1>=0&&this.noTailAt(this.head.x,this.head.y-1))
					this.head=new Point(this.head.x, this.head.y - 1);
				else game.over=true;
			}else if (this.direction == DOWN){
				if(this.head.y +1< (limitW+1)&&this.noTailAt(this.head.x,this.head.y+1))
					this.head=new Point(this.head.x, this.head.y + 1);
				else game.over=true;
			}else if (this.direction == LEFT){
				if(this.head.x -1>=0&&this.noTailAt(this.head.x-1,this.head.y))
					this.head=new Point(this.head.x - 1, this.head.y);
				else game.over=true;
			}else if (this.direction == RIGHT){
				if(this.head.x +1< (limitH+1)&&this.noTailAt(this.head.x+1,this.head.y))
					this.head=new Point(this.head.x + 1, this.head.y);
				else game.over=true;
			}
			
			if(this.snakeParts.length > this.tailLength){
				this.snakeParts.shift();
			}
			if(game.cherry != null){
				if(this.head.equals(game.cherry)){
					game.score+=10;
					this.tailLength++;
					game.cherry.create();
				}
			}
			// end
			
		}
	}
	
	this.noTailAt = function(x,y){
		var result = true;
		this.snakeParts.forEach(function(p){
			if(p.equals(new Point(x,y))){
				result = false;
				return false;
			}
		});
		return result;
	}
	
	this.draw = function(){
		for (var i = 0; i < this.snakeParts.length; i++) {
			var part = document.createElement('div');
			part.className = "snakeParts";
			part.style.left = (this.snakeParts[i].x * pixelSize) + 'px';
			part.style.top = (this.snakeParts[i].y * pixelSize) + 'px';
			
			this.container.appendChild(part);
		}
	}
	
	this.init = function(){
		this.snakeParts = [];
		this.tailLength=1;
		this.direction=DOWN;
		
		this.head= new Point(0,0);
	}
	this.init();
	
	/*
	 * not working - context of this.move were not snake but window
	(function init(snake){
		snake.snakeParts = [];
		snake.tailLength=1;
		snake.direction=DOWN;
		
		snake.head= new Point(0,0);
		console.log('init')
		console.log(snake);
		snake.move.call(snake);
	})(this);
	*/
	
}

Cherry = function(container){
	this.x = null;
	this.y = null;
	this.cherry = null;
	this.container = container;
	
	this.create = function(){
		this.x = getRandomInt(0,limitW);
		this.y = getRandomInt(0,limitH);
		this.cherry= new Point(this.x, this.y);
	}
	
	this.draw = function(){
		var cherry = document.createElement('div');
		cherry.className = "cherry";
		cherry.style.left = (this.x * pixelSize) + 'px';
		cherry.style.top = (this.y * pixelSize) + 'px';
		
		this.container.appendChild(cherry);
	}
	
	this.create();
	
};

KeyHandler = function(game){
	this.game = game;
	
	this.handler = function(e){
		if(e.which == 40){
			this.game.snake.direction = DOWN;
		}else if(e.which == 39){
			this.game.snake.direction = RIGHT;
		}else if(e.which == 37){
			this.game.snake.direction = LEFT;
		}else if(e.which == 38){
			this.game.snake.direction = UP;
		}else if(e.which == 32){//spacebar
			if(this.game.over) main(); //restart the game
			else this.game.paused = !this.game.paused;
		}
	};
	
	window.addEventListener('keydown',this.handler/*,true*/);
}

Point = function(x,y){
	this.x =x;
	this.y =y;
	
	this.equals = function(a){
		return a && a.x == this.x && a.y == this.y;
	}
}

Timer = function(speed){
	this.time = 0;
	this.speed= speed;
	
	this.start = function(){
		var inc = 50 * this.speed;
		
		setInterval(increment.bind(this,inc),inc);
		
		function increment(val){
			this.time += val;
		}
	}
	
	this.getTimer = function(){
		return this.time;
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}