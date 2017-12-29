window.onload = function WindowLoad(event) {
	main();
}

var App = {container:null,over:null,paused:null,game:null,keyHandler:null};
var UP=0, DOWN=1, LEFT=2, RIGHT=3, SCALE=10; 
var pixelSize = 10;
var limitH = 69; 
var limitW = 79;

function main(){
	App.container = document.getElementById('container');
	App.over = document.getElementById('over');    
	App.paused = document.getElementById('paused');
	App.game = new Game(container);
	App.keyHandler = new KeyHandler();
}

Game = function(container){
	this.container = container;
	this.snake = null;
	this.cherry = null;
	
	this.ticks =0;
	this.score = 0;
	this.over = false;
	this.paused = false;
	this.speed = 4/10;//do not set higher than 5/10
	this.interval = null;
	
	this.run = function(){
		if(!this.over && !this.paused){
			this.ticks++;
			this.snake.move(this);
		}
		this.render();
	};
	
	this.destroy = function(){
		clearInterval(this.interval);
		App.game = null;
		delete App.game;
	}
	
	this.drawScore = function(){
		var part = document.createElement('div');
		part.className = "score";
		part.style.left = ((this.container.offsetWidth / 2) - 10) + 'px';
		part.style.top = '0px';
		part.innerText = this.score;
		
		this.container.appendChild(part);
	}
	
	this.render = function(){
		while (this.container.firstChild) {
			this.container.removeChild(this.container.firstChild);
		}
		this.snake && this.snake.draw();
		this.cherry && this.cherry.draw();
		this.drawScore();
		
		if(this.over || this.paused){
			if(this.paused && this.container.querySelector('#paused') == null){
				this.container.appendChild(App.paused);
			}
			if(this.over && this.container.querySelector('#over') == null){
				clearInterval(this.interval);
				this.container.appendChild(App.over);
				document.getElementById('final-score').innerText = ' Total Score : ' + this.score
			}
		}
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
	this.tailLength = 10;
	this.head = new Point(0,0);
	this.direction = DOWN;
	
	
	this.move = function(game){
		if (game && game.ticks % 2 == 0 && this.head!=null&&!game.over&&!game.paused) {
			
			this.snakeParts.push(new Point(this.head.x, this.head.y));
			
			// start
			if (this.direction == UP){
				if(this.head.y- 1 >= 0&&this.noTailAt(this.head.x,this.head.y-1))
					this.head=new Point(this.head.x, this.head.y - 1);
				else game.over=true;  
			}else if (this.direction == DOWN){
				if(this.head.y+1<= limitH &&this.noTailAt(this.head.x,this.head.y+1))
					this.head=new Point(this.head.x, this.head.y + 1);
				else game.over=true;
			}else if (this.direction == LEFT){
				if(this.head.x-1>= 0&&this.noTailAt(this.head.x-1,this.head.y))
					this.head=new Point(this.head.x - 1, this.head.y);
				else game.over=true;
			}else if (this.direction == RIGHT){
				if(this.head.x+1 <= limitW &&this.noTailAt(this.head.x+1,this.head.y))
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

KeyHandler = function(){
	
	this.handler = function(e){
		var direction = App.game && App.game.snake.direction;
		
		if(e.which == 40 && direction!=UP){
			App.game.snake.direction = DOWN;
		}else if(e.which == 39 && direction!=LEFT){
			App.game.snake.direction = RIGHT;
		}else if(e.which == 37 && direction!=RIGHT){
			App.game.snake.direction = LEFT;
		}else if(e.which == 38 && direction!=DOWN){
			App.game.snake.direction = UP;
		}else if(e.which == 32){//spacebar
			if(App.game.over){
				App.game.destroy();
				App.game = new Game(container);
			}else App.game.paused = !App.game.paused;
		}
	};
	
	window.addEventListener('keydown',this.handler/*.bind(this),true*/);
}

Point = function(x,y){
	this.x =x;
	this.y =y;
	
	this.equals = function(a){
		return a && a.x == this.x && a.y == this.y;
	}
	
	this.getPoint = function(){
		return {x:this.x,y:this.y};
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}